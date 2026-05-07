import api from "../../../api/axiosInstance"; // your axios instance

const getUsers = async (token, search = "", page = 1, limit = 5) => {
  const response = await api.get(
    `/users?search=${search}&page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data.payload; // { users, pagination }
};

const userService = {
  getUsers,
};

export default userService;
