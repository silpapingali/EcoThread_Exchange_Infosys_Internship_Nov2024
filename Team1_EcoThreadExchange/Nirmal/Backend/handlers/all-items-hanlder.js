
const Item=require("./../db/myitems")

async function getAllItems(req, res) {
  try {
    // Fetch all items from the database
    const items = await Item.find(); 

    // If no items are found, return an empty array
    if (!items) {
      return res.status(404).send({ error: "No items found" });
    }

    // Return the found items
    res.status(200).json(items);
  } catch (error) {
    console.error('Error retrieving items:', error);
    res.status(500).json({ error: "Server Error" });
  }
}

module.exports = { getAllItems };