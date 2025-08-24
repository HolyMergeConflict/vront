const endpoints = {
  auth: {
    login: "/auth/login", // expects {username, password}
    register: "/auth/register", // expects {email, username, password, role?}
    me: "/users/me",
    logout: "/auth/logout", // optional
  },
  users: "/users",
  tasks: "/tasks",
  taskHistory: {
    base: "/task-history",
    my: "/task-history/my",
    byStatus: (status: string) =>
      `/task-history/my/by-status?status=${encodeURIComponent(status)}`,
    myForTask: (taskId: number) => `/task-history/my/task/${taskId}`,
    myLatest: (taskId: number) => `/task-history/my/task/${taskId}/latest`,
  },
  moderation: "/tasks/moderation",
};
export default endpoints;
