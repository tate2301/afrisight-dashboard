import { useRouter } from "next/router";
import { Suspense, useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import GeneralLayout from "@/layout/GeneralLayout";
import axiosInstance from "@/hooks/useApiFetcher";
import { SURVEY_ROUTES } from "@/lib/api-routes";
import {
  Save
} from "lucide-react";
import {
  Table,
  TableBody, TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Checkbox, RadioCards, Section, Tabs } from "@radix-ui/themes";
import { FormBuilder } from "@/forms-builder/components/FormBuilder";
import { FormProvider, useFormContext } from "@/forms-builder/context";
import Flex from "@/components/design-sytem/flex";
import Button from "@/components/design-sytem/button";
import Box from "@/components/design-sytem/box";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useFormik } from "formik";
import { Caption, H2, H3, Paragraph } from "@/components/design-sytem/typography";
import Separator from "@/components/design-sytem/separator";
import apiClient from "@/hooks/useApiFetcher";
import { UseMutateFunction, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Spinner from "@/components/ui/spinner";
import { ClientsCombobox, ErrorMessage, TextInput } from "./create_gig";
import { GigClientInfo } from "@/components/gig-form/GigClientInfo";
import { withFormState } from "@/components/gig-form/withFormState";
import { GigDateInfo } from "@/components/gig-form/GigDateInfo";
import { GigRewardPolicy } from "@/components/gig-form/GigRewardPolicy";

type User = {
  role: "CLIENT";
  status: "ACTIVE" | "INACTIVE";
  email: string;
  username: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isSocialConnectedUser: boolean;
  emailVerificationToken: string | null;
  emailVerificationTokenExpires: string | null;
  password: string;
  refreshTokens: string[];
  resetPasswordExpires: string | null;
  resetPasswordToken: string | null;
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
  _id: string;
  __v: number;
};

type RewardPolicy = {
  _id: string;
  name: string;
  description: string;
  dollarValue: number;
  pointsValue: number;
};

type Gig = {
  name: string;
  description: string;
  coverImage: string;
  difficulty: "easy" | "medium" | "hard";
  dollarRewardValue: number;
  duration: string;
  startDate: string;
  endDate: string;
  status: "DRAFT" | "ACTIVE" | "COMPLETED";
  targetParticipants: number;
  completedParticipants: number;
  views: number;
  rewardPolicy: RewardPolicy;
  createdAt: string;
  updatedAt: string;
  questionOrdering: "preserve" | "shuffle"
  category: string
  client: string
  form: string
  _id: string;
  __v: number;
};


const PATCH_GIG = (id: string) => (`/survey/${id}`);

const patchGig = async (_id: string, data: FormState) => apiClient.put(PATCH_GIG(_id), data)

type TabProps = {
  _id: string
  mutate: UseMutateFunction<void, Error, FormState, unknown>
  isPending: boolean
  formik: any
}
type BehaviorTabValues = Pick<FormState, "questionOrdering" | "difficulty">
type RewardPolicyValues = Pick<FormState, "rewardPolicy">
interface GigBasicInfoProps {
  values: any;
  errors: any;
  touched: any;
  handleChange: (e: React.ChangeEvent<any>) => void;
  handleBlur: (e: React.FocusEvent<any>) => void;
  setFieldValue: (field: string, value: any) => void;
}

type Response = {
  _id: string
  email: string
  createdAt: string
  [key: string]: string | number
}
type BasicInfoValues = Pick<Gig, "name" | "description" | "client">

interface FormBuilderHeaderProps {
  save: (form: any) => void;
  publish: (form: any) => void;
}


type FormState = Omit<Gig, "rewardPolicy"> & { rewardPolicy: string }

export default function GigPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { _id: id } = router.query;
  const queryKey = `gig-${id}`

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: FormState) => {
      await patchGig(id as string, values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    }
  });
  const [survey, setSurvey] = useState<Gig | null>(null);

  const fetchGigData = async (id: string) => {
    const gigResponse = await axiosInstance.get(
      SURVEY_ROUTES.GET_SURVEY_BY_ID(id),
    );
    setSurvey(gigResponse);
    console.log(gigResponse);
  };

  const saveGigChanges = useCallback((form: string) => {
    if (!survey) return;

    const values = { ...survey, form: form } as unknown as FormState
    mutate(values)
  }, [survey])

  const publishGig = useCallback((form: any) => {
    saveGigChanges(form)
  }, [saveGigChanges]);


  useEffect(() => {
    if (id) {
      fetchGigData(id as string);
    }
  }, [id]);

  if (!survey) {
    return (
      <GeneralLayout>
        <GigSkeleton />
      </GeneralLayout>
    )
  }

  return <GigPresenter {...{ survey, mutate, isPending, saveGigChanges, publishGig }} />
}

function GigPresenter(props: {
  survey: Gig
  mutate: UseMutateFunction<void, Error, FormState, unknown>
  isPending: boolean
  saveGigChanges: (form: any) => void
  publishGig: (form: any) => void
}) {
  const { survey, mutate, isPending, saveGigChanges, publishGig } = props
  const { _id: id } = survey;

  const formik = useFormik({
    initialValues: { ...survey, rewardPolicy: survey.rewardPolicy._id },
    onSubmit: (values) => mutate(values)
  })

  return (
    <GeneralLayout>
      <Suspense fallback={<GigSkeleton />}>
        {
          survey && (
            <FormProvider initialForm={survey?.form}>
              <Tabs.Root defaultValue="responses">
                <Tabs.List className="flex justify-between gap-2 sticky top-0 h-[48px] z-[2000] bg-white">
                  <Flex className="h-full items-end">
                    <Tabs.Trigger value="responses">Responses</Tabs.Trigger>
                    <Tabs.Trigger value="questions">Questions</Tabs.Trigger>
                    {/* <Tabs.Trigger value="basic-info">Settings</Tabs.Trigger>
                  <Tabs.Trigger value="additional">Additional information</Tabs.Trigger>
                  <Tabs.Trigger value="reward-policy">Reward Policy</Tabs.Trigger> */}
                  </Flex>
                  <NavActions save={saveGigChanges} publish={publishGig} />
                </Tabs.List>
                <ResponsesTab _id={id as string} />
                <QuestionsTab _id={id as string} description={survey.description} name={survey.name} form={survey.form} />
                {survey && <BasicInfoTab formik={formik} {...survey} mutate={mutate} isPending={isPending} />}
                <BehaviorTab _id={id as string} formik={formik} mutate={mutate} isPending={isPending} />
                <Tabs.Content value="reward-policy">
                  <RewardPolicyTab _id={id as string} formik={formik} mutate={mutate} isPending={isPending} rewardPolicy={survey.rewardPolicy._id} />
                </Tabs.Content>
              </Tabs.Root>
            </FormProvider>
          )
        }
      </Suspense>
    </GeneralLayout>
  );
}

function GigSkeleton() {
  return (
    <Card className="mx-auto mt-8">
      <CardHeader>
        <Skeleton className="h-8 w-3/4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-2" count={3} />
        <Skeleton className="h-6 w-1/4 mb-4" />
        <Skeleton className="h-10 w-32" />
      </CardContent>
    </Card>
  );
}

const NavActions = ({ save, publish }: FormBuilderHeaderProps) => {
  const { form, exportForm } = useFormContext()
  const onSaveChanges = () => save(exportForm())
  const onPublish = () => publish(form)
  return (
    <Flex alignItems="center" css={{ gap: "8px" }}>
      <Button variant="outline" colorScheme="surface" onClick={onSaveChanges}>
        <Save className='size-4 mr-2' />
        Save changes
      </Button>
      <Button onClick={onPublish}>
        Publish
      </Button>
    </Flex>
  )
}

const FormTabBottomBar = ({ dirty, loading }: { dirty: boolean, loading: boolean }) => (
  <>
    <Separator className="my-6" />
    <Flex css={{ marginTop: 20 }}>
      <Button css={{ width: 140 }} type={"submit"} disabled={!dirty || loading} colorScheme={(dirty && !loading) ? "primary" : "surface"}>
        {loading ? <Spinner /> : "Save changes"}
      </Button>
    </Flex>
  </>
)



/** Forms */

const ClientInfo = withFormState(({ formik }: { formik: any }) => (
  <form onSubmit={formik.handleSubmit}>
    <GigClientInfo
      values={formik.values}
      errors={formik.errors}
      touched={formik.touched}
      setFieldValue={formik.setFieldValue}
    />
    {/* <GigBasicInfo
      values={formik.values}
      errors={formik.errors}
      touched={formik.touched}
      handleChange={formik.handleChange}
      handleBlur={formik.handleBlur}
    /> */}
    <Button type="submit" disabled={!formik.isValid || formik.isSubmitting}>
      Save Changes
    </Button>
  </form>
));

const DateInfo = ({ formik }: { formik: any }) => (
  <GigDateInfo
    values={formik.values}
    errors={formik.errors}
    touched={formik.touched}
    handleChange={formik.handleChange}
    handleBlur={formik.handleBlur}
  />
);

const RewardPolicy = ({ formik }: { formik: any }) => {
  console.log({ formik })
  return (
    <GigRewardPolicy
      values={formik.values}
      errors={formik.errors}
      touched={formik.touched}
      setFieldValue={formik.setFieldValue}
    />
  )
};


const QuestionOrderingSection = ({ formik }: { formik: any }) => (
  <Box className="mb-6" css={{ maxWidth: 800 }}>
    <Paragraph weight={'bold'} color={'primary'}>Question ordering</Paragraph>
    <Paragraph className="mb-4">
      Configure how questions are presented to participants of this gig.
    </Paragraph>
    <RadioCards.Root
      name="questionOrdering"
      value={formik.values.questionOrdering}
      onValueChange={(value) => formik.setFieldValue('questionOrdering', value)}
      defaultValue="preserve"
      columns={{ initial: '1', sm: '3' }}
    >
      <RadioCards.Item value="preserve">
        <Flex direction="column">
          <Paragraph weight="bold" color={'primary'}>Preserve order</Paragraph>
          <Paragraph>Questions will be presented in the order they were added.</Paragraph>
        </Flex>
      </RadioCards.Item>
      <RadioCards.Item value="shuffle">
        <Flex direction="column">
          <Paragraph weight="bold" color={'primary'}>Shuffle mode</Paragraph>
          <Paragraph>Shuffle the questions every time they're presented.</Paragraph>
        </Flex>
      </RadioCards.Item>
    </RadioCards.Root>
  </Box>
)

const DifficultySection = ({ formik }: { formik: any }) => (
  <Box css={{ maxWidth: 800 }}>
    <Paragraph weight={'bold'} color={'primary'}>Difficulty</Paragraph>
    <Paragraph className="mb-4">
      How difficult is it to complete this gig for an average person
    </Paragraph>
    <RadioCards.Root
      name="difficulty"
      value={formik.values.difficulty}
      onValueChange={(value) => formik.setFieldValue('difficulty', value)}
      defaultValue="easy"
      columns={{ initial: '1', sm: '3' }}
    >
      <RadioCards.Item value="easy">
        <Flex direction="column">
          <Paragraph weight="bold" color={'primary'}>Easy</Paragraph>
          <Paragraph>Pretty straightforward, no domain experience required.</Paragraph>
        </Flex>
      </RadioCards.Item>
      <RadioCards.Item value="hard">
        <Flex direction="column">
          <Paragraph weight="bold" color={'primary'}>Hard</Paragraph>
          <Paragraph>Domain experience might be required, but at the general level</Paragraph>
        </Flex>
      </RadioCards.Item>
      <RadioCards.Item value="extreme">
        <Flex direction="column">
          <Paragraph weight="bold" color={'primary'}>Extreme</Paragraph>
          <Paragraph>Requires in-depth knowledge of the subject-matter.</Paragraph>
        </Flex>
      </RadioCards.Item>
    </RadioCards.Root>
  </Box>
)

export const GigBasicInfo: React.FC<GigBasicInfoProps> = ({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  setFieldValue,
}) => {

  const clientsQuery = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const res = await axiosInstance.get('/admin/client');
      const data = res.docs.map((doc: any) => ({
        data: {
          name: doc.firstname,
          email: doc.user.email,
          profilePic: doc.profilePic,
          _id: doc.user._id,
        },
        label: doc.firstname,
        value: doc.user._id,
      }));

      return data;
    },
  });

  return (
    <>
      <label className="space-y-2">
        <Paragraph weight={'semibold'}>
          Client <span className="text-red-500">*</span>
        </Paragraph>
        <ClientsCombobox
          value={values.client}
          form={
            { setFieldValue }
          }
          data={clientsQuery.data ?? []}
        />
        {touched.client && errors.client && (
          <ErrorMessage>{errors.client}</ErrorMessage>
        )}
      </label>

      <label className="mb-4">
        <Paragraph weight={'semibold'}>
          Title <span className="text-red-500">*</span>
        </Paragraph>
        <TextInput
          name="name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.name && errors.name && (
          <ErrorMessage>{errors.name}</ErrorMessage>
        )}
        <Caption color={'secondary'} className="mt-2">
          Pay attention to the title and make sure it aligns with the goals of the client and their brand voice.
        </Caption>
      </label>

      <label className="mb-4">
        <Paragraph weight={'semibold'}>
          Description <span className="text-red-500">*</span>
        </Paragraph>
        <TextInput
          name="description"
          value={values.description}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.description && errors.description && (
          <ErrorMessage>{errors.description}</ErrorMessage>
        )}
      </label>

      {/* Add other basic info fields here */}
    </>
  );
};
/** End Forms */

/** Tabs */
const QuestionsTab = ({ _id, name, description, form }: { _id: string } & Pick<Gig, "description" | "name" | "form">) => {
  return (
    <Tabs.Content value="questions">
      <FormBuilder gig_id={_id} formDescription={description} formName={name} />
    </Tabs.Content>
  )
}
const BehaviorTab = ({ _id, mutate, isPending, formik }: TabProps) => {
  return (
    <Tabs.Content value="additional">
      <Section className="container mx-auto">
        <form onSubmit={formik.handleSubmit}>
          <H2
            weight={'semibold'}
            color={'primary'}
            className="mb-6">
            Gig behaviour and options
          </H2>
          <QuestionOrderingSection formik={formik} />
          <DifficultySection formik={formik} />
          <FormTabBottomBar dirty={formik.dirty} loading={isPending} />
        </form>
      </Section>
    </Tabs.Content>
  )
}

const RewardPolicyTab = ({ isPending, formik }: TabProps & RewardPolicyValues) => {

  return (
    <Tabs.Content value="reward-policy">
      <Section className="container mx-auto">
        <form onSubmit={formik.handleSubmit}>
          <H3 weight={'semibold'} color={'primary'} className="mb-6">Reward Policy</H3>
          <RewardPolicy formik={formik} />
          <FormTabBottomBar dirty={formik.dirty} loading={isPending} />
        </form>
      </Section>
    </Tabs.Content >
  )
}

const BasicInfoTab = ({
  _id,
  client,
  description,
  name,
  mutate,
  isPending,
  formik
}: TabProps & BasicInfoValues) => {
  return (
    <Tabs.Content value={"basic-info"}>
      <Section className="container mx-auto">
        <form onSubmit={formik.handleSubmit}>
          <H2
            weight={'semibold'}
            color={'primary'}
            className="mb-6">
            Gig Settings
          </H2>
          <Paragraph className="mb-4">
            This information will be publicly available to participants
          </Paragraph>
          <Flex className="space-y-4 flex-col">
            <GigBasicInfo {...formik} />
          </Flex>
          <FormTabBottomBar dirty={formik.dirty} loading={isPending} />
        </form>
      </Section>
    </Tabs.Content>
  )
}
/** End Tabs */



const responsesColumns: ColumnDef<Response>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
  },
  {
    id: "email",
    accessorKey: "email",
    header: "Email"
  },

]

const ResponsesTab = ({ _id }: { _id: string }) => {
  const [columns, setColumns] = useState(responsesColumns)

  const table = useReactTable({
    data: [],
    columns: responsesColumns,
    getCoreRowModel: getCoreRowModel(),
  });


  return (
    <Tabs.Content value={"responses"}>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={responsesColumns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Tabs.Content>
  )
}