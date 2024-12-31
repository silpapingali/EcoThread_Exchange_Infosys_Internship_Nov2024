const Item=require("./../db/myitems")
const allTrades=require("./../db/alltrades")




async function getAllItems(req, res) {
  try {
    const items = await Item.find();
    if (!items) {
      return res.status(404).send({ error: "No items found" });
    }
    res.status(200).json(items);
  } catch (error) {
    console.error('Error retrieving items:', error);
    res.status(500).json({ error: "Server Error" });
  }
}

function buildFilterQuery({ searchTerm, exactMatch, date }) {
    let filterQuery = {};
    if (searchTerm) {
        const searchRegex = exactMatch === 'true'
            ? new RegExp(`^${searchTerm}$`, 'i')
            : new RegExp(searchTerm, 'i'); 
        filterQuery.$or = [
            { title: searchRegex },
            { size: searchRegex },
            { condition: searchRegex },
            { username: searchRegex },
            { preferences: { $elemMatch: { $regex: searchRegex } } },
            { offeredBy: { $elemMatch: { $regex: searchRegex } } },
        ];
    }
    if (date) {
        filterQuery.createdAt = { $gte: new Date(date) }; 
    }
    return filterQuery;
}



module.exports = { getAllItems,buildFilterQuery };