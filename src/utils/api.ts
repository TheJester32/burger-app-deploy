const BASE_URL = 'https://norma.nomoreparties.space/api';

async function checkResponse(response: Response) {
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Ошибка на стороне сервера');
    }
    return response.json();
  }

  const checkWsResponse = (data: string) => {
    const parsedData = JSON.parse(data); 
    if (parsedData.success === false) {
      throw new Error(parsedData.message || 'Unknown error');
    }
    return parsedData;
  };

export {BASE_URL, checkResponse, checkWsResponse};