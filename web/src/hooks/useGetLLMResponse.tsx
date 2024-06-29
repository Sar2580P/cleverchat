import { useNotification } from "./useNotification";

const useGetLLMResponse = () => {
  const { NotificationHandler } = useNotification();
  const getLLMResponse = async (path: string) => {
    console.log(path);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/agents/${path}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      const responsedata = await response.json();
      console.log(responsedata);
      if (responsedata.message === "Failed") {
        NotificationHandler("Clever Chat", responsedata.response, "Error");
        return null;
      }
      return responsedata.response;
    } catch (err) {
      console.log(err);
      NotificationHandler("Clever Chat", "Something went wrong", "Error");
      return null;
    }
  };
  return { getLLMResponse };
};

export default useGetLLMResponse;
