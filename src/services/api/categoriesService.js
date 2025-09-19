import mockCategories from "@/services/mockData/categories.json";

let categories = [...mockCategories];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const categoriesService = {
  async getAll() {
    await delay(200);
    return [...categories];
  },

  async getById(id) {
    await delay(150);
    const category = categories.find(c => c.Id === parseInt(id));
    return category ? { ...category } : null;
  },

  async create(categoryData) {
    await delay(300);
    const newCategory = {
      Id: Math.max(...categories.map(c => c.Id), 0) + 1,
      name: categoryData.name,
      color: categoryData.color || "#64748b",
      taskCount: 0
    };
    categories.push(newCategory);
    return { ...newCategory };
  },

  async update(id, categoryData) {
    await delay(250);
    const index = categories.findIndex(c => c.Id === parseInt(id));
    if (index === -1) return null;
    
    const updatedCategory = {
      ...categories[index],
      ...categoryData,
      Id: parseInt(id)
    };
    
    categories[index] = updatedCategory;
    return { ...updatedCategory };
  },

  async delete(id) {
    await delay(200);
    const index = categories.findIndex(c => c.Id === parseInt(id));
    if (index === -1) return false;
    
    categories.splice(index, 1);
    return true;
  }
};

export default categoriesService;