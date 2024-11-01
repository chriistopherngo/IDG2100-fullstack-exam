import GameSuperAssessmentCardWrapper from './SB-wrappers/GameSuperAssessmentCardWrapper';

export default {
  title: 'Components/GameSuperAssessmentCard',
  component: GameSuperAssessmentCardWrapper,
};

const Template = (args) => <GameSuperAssessmentCardWrapper {...args} />;

export const Context = Template.bind({});
Context.args = {
  cardId: '1',
  cardCategory: 'context',
  cardName: 'Assessment Context',
  cardDescription: 'This is a description of the assessment context.',
  cardDetails: 'Details about the assessment context.',
  cardIcon: '/public/icons/icon-context.png',
};

export const Assessor = Template.bind({});
Assessor.args = {
  cardId: '2',
  cardCategory: 'the assessor',
  cardName: 'The Assessor',
  cardDescription: 'Description of the assessor.',
  cardDetails: 'Details about the assessor.',
  cardIcon: '/public/icons/icon-assessor.png',
};


export const Assessed = Template.bind({});
Assessed.args = {
  cardId: '3',
  cardCategory: 'who is assessed',
  cardName: 'Who is Assessed',
  cardDescription: 'Description of who is assessed.',
  cardDetails: 'Details about who is assessed.',
  cardIcon: '/public/icons/icon-assessed.png',
};



export const Timing = Template.bind({});
Timing.args = {
  cardId: '4',
  cardCategory: 'assessment timing',
  cardName: 'Assessment Timing',
  cardDescription: 'Description of the assessment timing.',
  cardDetails: 'Details about the assessment timing.',
  cardIcon: '/public/icons/icon-timing.png',
};


export const Format = Template.bind({});
Format.args = {
  cardId: '5',
  cardCategory: 'assessment format',
  cardName: 'Assessment Format',
  cardDescription: 'Description of the assessment format.',
  cardDetails: 'Details about the assessment format.',
  cardIcon: '/public/icons/icon-format.png',
};


export const Artefact = Template.bind({});
Artefact.args = {
  cardId: '6',
  cardCategory: 'assessment artefact',
  cardName: 'Assessment Artefact',
  cardDescription: 'Description of the assessment artefact.',
  cardDetails: 'Details about the assessment artefact.',
  cardIcon: '/public/icons/icon-artefact.png',
};


