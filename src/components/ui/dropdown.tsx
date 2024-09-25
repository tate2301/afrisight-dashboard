import styled from "../design-sytem/theme";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

const DropdownContainer = styled(DropdownMenu.Content, {
    backgroundColor: '$white',
    borderRadius: '12px',
    padding: '$1',

})

const DropdownItem = styled(DropdownMenu.Item, {
    height: 36,
    padding: '$4',

})

export const Dropdown = {
    Root: DropdownMenu.Root,
    Container: DropdownContainer,
    Item: DropdownItem,
    Trigger: DropdownMenu.Trigger,
}