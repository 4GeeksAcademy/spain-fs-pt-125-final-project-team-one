export const initialStore = () => {
  return {
    message: null,
    api: {
      data: null,
      loading: false,
      error: null,
    },
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    
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
