
export async function post(url: string, body: Record<string, any>): Promise<any> {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
  return await fetch(url, requestOptions);
}
