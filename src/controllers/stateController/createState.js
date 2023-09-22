import State from "../../models/state.model.js";

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
