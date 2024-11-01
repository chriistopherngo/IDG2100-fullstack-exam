import GameSuperMissionCardWrapper from './SB-wrappers/GameSuperMissionCardWrapper';

export default {
  title: 'Components/GameSuperMissionCard',
  component: GameSuperMissionCardWrapper,
};

const Template = (args) => <GameSuperMissionCardWrapper {...args} />;

export const Default = Template.bind({});
Default.args = {
  cardId: '1',
  cardType: 'Mission',
  cardName: 'Innovation',
  cardDescription: 'Your mission is To find and support new and innovative ways of assessing students.',
  cardIcon: '/public/icons/icon-mission.png',
};
