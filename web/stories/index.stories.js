import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Button, Welcome } from '@storybook/react/demo';
import FileExplorer from "../src/PackageExplorer";
import ContextMenu from "../src/components/context-menu/ContextMenu";

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);

storiesOf('Button', module)
  .add('with text', () => <Button onClick={action('clicked')}>Hello Button</Button>)
  .add('with some emoji', () => (
    <Button onClick={action('clicked')}>
      <span role="img" aria-label="so cool">
        😀 😎 👍 💯
      </span>
    </Button>
  ));

const menuItems = [
  {action: 'copy', onClick: () => console.log('click copy '), label: 'Copy'}
];

storiesOf('PackageExplorer', module)
  .add('default', () => <FileExplorer/>)
  .add('test', () => <ContextMenu id="test1" menuItems={menuItems}>Test</ContextMenu>)
;