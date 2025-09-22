import { toast } from 'react-toastify';

const tasksService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "category_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await apperClient.fetchRecords('task_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (!response?.data?.length) {
        return [];
      }

      // Transform database fields to UI format for compatibility
      return response.data.map(task => ({
        Id: task.Id,
        title: task.title_c || task.Name || "",
        description: task.description_c || "",
        completed: task.completed_c || false,
        priority: task.priority_c || "Medium",
        dueDate: task.due_date_c || null,
        category: task.category_c?.Name || "Personal",
        createdAt: task.created_at_c || new Date().toISOString(),
        completedAt: task.completed_at_c || null
      }));
    } catch (error) {
      console.error("Error fetching tasks:", error?.response?.data?.message || error);
      toast.error("Failed to load tasks");
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "category_c"}}
        ]
      };

      const response = await apperClient.getRecordById('task_c', id, params);

      if (!response?.data) {
        return null;
      }

      // Transform database fields to UI format
      const task = response.data;
      return {
        Id: task.Id,
        title: task.title_c || task.Name || "",
        description: task.description_c || "",
        completed: task.completed_c || false,
        priority: task.priority_c || "Medium",
        dueDate: task.due_date_c || null,
        category: task.category_c?.Name || "Personal",
        createdAt: task.created_at_c || new Date().toISOString(),
        completedAt: task.completed_at_c || null
      };
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(taskData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Get category ID for lookup field
      let categoryId = null;
      if (taskData.category && taskData.category !== "Personal") {
        const categoryParams = {
          fields: [{"field": {"Name": "Id"}}, {"field": {"Name": "name_c"}}],
          where: [{"FieldName": "name_c", "Operator": "ExactMatch", "Values": [taskData.category]}]
        };
        const categoryResponse = await apperClient.fetchRecords('category_c', categoryParams);
        if (categoryResponse.success && categoryResponse.data?.length > 0) {
          categoryId = categoryResponse.data[0].Id;
        }
      }

      const params = {
        records: [{
          Name: taskData.title || "New Task",
          title_c: taskData.title || "",
          description_c: taskData.description || "",
          completed_c: false,
          priority_c: taskData.priority || "Medium",
          due_date_c: taskData.dueDate || null,
          created_at_c: new Date().toISOString(),
          completed_at_c: null,
          ...(categoryId && { category_c: categoryId })
        }]
      };

      const response = await apperClient.createRecord('task_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} records:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const createdTask = successful[0].data;
          toast.success("Task created successfully");
          return {
            Id: createdTask.Id,
            title: createdTask.title_c || createdTask.Name || "",
            description: createdTask.description_c || "",
            completed: createdTask.completed_c || false,
            priority: createdTask.priority_c || "Medium",
            dueDate: createdTask.due_date_c || null,
            category: createdTask.category_c?.Name || "Personal",
            createdAt: createdTask.created_at_c || new Date().toISOString(),
            completedAt: createdTask.completed_at_c || null
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error creating task:", error?.response?.data?.message || error);
      toast.error("Failed to create task");
      return null;
    }
  },

  async update(id, taskData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Get category ID for lookup field if category is being updated
      let categoryId = null;
      if (taskData.category) {
        const categoryParams = {
          fields: [{"field": {"Name": "Id"}}, {"field": {"Name": "name_c"}}],
          where: [{"FieldName": "name_c", "Operator": "ExactMatch", "Values": [taskData.category]}]
        };
        const categoryResponse = await apperClient.fetchRecords('category_c', categoryParams);
        if (categoryResponse.success && categoryResponse.data?.length > 0) {
          categoryId = categoryResponse.data[0].Id;
        }
      }

      const updateData = {
        Id: parseInt(id)
      };

      // Only include updateable fields that are being changed
      if (taskData.title !== undefined) {
        updateData.Name = taskData.title;
        updateData.title_c = taskData.title;
      }
      if (taskData.description !== undefined) updateData.description_c = taskData.description;
      if (taskData.completed !== undefined) {
        updateData.completed_c = taskData.completed;
        updateData.completed_at_c = taskData.completed ? new Date().toISOString() : null;
      }
      if (taskData.priority !== undefined) updateData.priority_c = taskData.priority;
      if (taskData.dueDate !== undefined) updateData.due_date_c = taskData.dueDate;
      if (categoryId !== null) updateData.category_c = categoryId;

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('task_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} records:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const updatedTask = successful[0].data;
          toast.success("Task updated successfully");
          return {
            Id: updatedTask.Id,
            title: updatedTask.title_c || updatedTask.Name || "",
            description: updatedTask.description_c || "",
            completed: updatedTask.completed_c || false,
            priority: updatedTask.priority_c || "Medium",
            dueDate: updatedTask.due_date_c || null,
            category: updatedTask.category_c?.Name || "Personal",
            createdAt: updatedTask.created_at_c || new Date().toISOString(),
            completedAt: updatedTask.completed_at_c || null
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error updating task:", error?.response?.data?.message || error);
      toast.error("Failed to update task");
      return null;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('task_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} records:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success("Task deleted successfully");
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Error deleting task:", error?.response?.data?.message || error);
      toast.error("Failed to delete task");
      return false;
    }
  }
};

export default tasksService;
export default tasksService;