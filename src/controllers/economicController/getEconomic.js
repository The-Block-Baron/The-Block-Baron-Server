import EconomicAct from '../../models/economicAct.model.js';

export const getEconomicActivitiesTypes = async (req, res) => {
  try {
    const activityTypes = EconomicAct.schema.path('type').enumValues;

    res.status(200).json({ activityTypes });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};