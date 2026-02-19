export const initialStore = () => {
  return {
    message: null,
    token: localStorage.getItem("jwt-token") || null,
    user: null,
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "LOGIN":
      return {
        ...store,
        token: action.payload,
      };

    case "LOGOUT":
      return {
        ...store,
        token: null,
        user: null,
        message: { msg: "👋 ¡Sesión cerrada con éxito!", status: 200 },
      };

    case "SET_MESSAGE":
      return {
        ...store,
        message: action.payload,
      };

    default:
      throw Error("Unknown action.");
  }
}
