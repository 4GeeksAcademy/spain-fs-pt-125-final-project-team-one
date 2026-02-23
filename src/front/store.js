export const initialStore = () => {
  return {
    message: null,
    token: localStorage.getItem("jwt-token") || null,
    user: null,
    api: {
      data: null,
      loading: false,
      error: null,
    },
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
    case "API_LOADING":
      return {
        ...store,
        api: {
          ...store.api,
          loading: true,
          error: null,
        },
      };

    case "API_SUCCESS":
      return {
        ...store,
        api: {
          data: action.payload,
          loading: false,
          error: null,
        },
      };

    case "API_ERROR":
      return {
        ...store,
        api: {
          ...store.api,
          loading: false,
          error: action.payload,
        },
      };

    default:
      throw Error("Unknown action.");
  }
}
