import Flex from "../design-sytem/flex"
import { Paragraph } from "../design-sytem/typography"
import { ChevronRight } from "../icons/chevron.right"

const Breadcrumbs = (props: {
    items: string[]
}) => {
    return (
        <Flex alignItems={"center"} css={{ gap: 8 }}>
            {props.items.map((item, index) => (
                <>
                    <Paragraph color={index === props.items.length - 1 ? "secondary" : "tertiary"} className="py-1 px-2 rounded-lg" css={{
                        "&:hover": {
                            backgroundColor: "$gray2"
                        }
                    }} weight={"medium"} key={index}>{item}</Paragraph>
                    {index !== props.items.length - 1 && <Paragraph color="tertiary" className="size-4" weight={"medium"}><ChevronRight /></Paragraph>}
                </>
            ))}
        </Flex>
    )
}

export default Breadcrumbs

