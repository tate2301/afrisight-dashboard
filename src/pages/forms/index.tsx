import React from 'react';
import GeneralLayout from '../../layout/GeneralLayout';
import Search from '../../components/search/Search';
import { ArrowPathIcon, LinkIcon, PlusIcon } from '@heroicons/react/24/outline';
import FormItem from '../../components/form-item/FormItem';
import useForms from '../../hooks/useForms';

function Forms() {
  const { forms, loading, error } = useForms();

  const generateFormsLink = () => {
    const url = `${process.env.NEXT_PUBLIC_FORMS_URL}/?type=shared&id=190911`;
    console.log(url);
    window.open(url, '_blank');
  };

  return (
    <GeneralLayout>
      <div className="max-w-7xl px-4 py-16 w-full mx-auto space-y-8 ">
        <div className="flex flex-row items-start justify-between">
          <div className="flex flex-col space-y-1">
            <p className="text-start font-bold heading-text text-3xl ">
              Manage Forms
            </p>
            <p className="text-start main-text text-sm text-zinc-500 max-w-2xl">
              Create forms or create forms link
            </p>
          </div>
          <div className="flex flex-row items-center gap-2">
            <div className="flex flex-row items-center bg-zinc-950 p-2 rounded-full capitalize font-medium text-white">
              <PlusIcon height={24} width={24} />
            </div>
            <button
              onClick={generateFormsLink}
              className="bg-zinc-950 rounded-full p-2 text-white"
            >
              <LinkIcon height={24} width={24} />
            </button>
            <div className="flex flex-row items-center bg-zinc-950 p-2 rounded-full capitalize font-medium text-white">
              <ArrowPathIcon height={24} width={24} />
            </div>
          </div>
        </div>
        {/* search and filter */}
        <Search />
        <div className="max-w-7xl w-full mx-auto">
          {loading && <div>loading</div>}
          {error && <div>errrrrr</div>}
          <div className=" flex-row flex-wrap grid md:grid-cols-3 grid-cols-1 gap-8 py-8">
            {forms.map((item) => (
              <FormItem
                key={item.id}
                item={item} // Spread the properties to match the FormItem props
              />
            ))}
          </div>
        </div>
      </div>
    </GeneralLayout>
  );
}

export default Forms;
