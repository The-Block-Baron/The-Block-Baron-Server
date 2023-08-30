import State from '../models/state.model.js';

export const createState = async (req, res) => {
  try {
    const { name } = req.body;
    const newState = new State({
      name,
    });

    await newState.save();
    res.status(201).json(newState);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getStates = async (req, res) => {
    try {
      const states = await State.find({});
      res.status(200).json(states);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  export const getState = async (req, res) => {
    try {
      const { id } = req.params;
      const state = await State.findById(id);
      if (!state) {
        return res.status(404).json({ error: 'Estado no encontrado' });
      }
      res.status(200).json(state);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };