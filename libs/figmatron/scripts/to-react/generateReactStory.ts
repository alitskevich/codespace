import { mapEntries, qname } from "ultimus";

export const generateReactStory = (metadata: any = {}) => {
  const { id: componentClassName, description, title, group = "design", labels, cases } = metadata;

  const casesCode = mapEntries(cases, (key, params) => {
    const args = mapEntries(params, (propName, propValue) => `    ${propName}: "${propValue}",`).join("\n    ");
    const output = ` export const ${componentClassName}_${qname(key)}: Story = {
  args: {
    ${args}
  },
};`;
    return output;
  }).join("\n");

  const output = `// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import type { Meta, StoryObj } from "@storybook/react";
import { ${componentClassName} } from "./${componentClassName}";

/**
 * Story for ${componentClassName} Component.
 * ${description}
 * 
 * @copyright ${metadata.copyright ?? '-'}.
 */
const meta: Meta<typeof ${componentClassName}> = {
  title: "${group}/${title}",
  component: ${componentClassName},
  
  tags: ${JSON.stringify(labels ?? [])},
  parameters: {
    
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof ${componentClassName}>;

export const ${componentClassName}Default: Story = {};

${casesCode}
`;

  return output;
};
