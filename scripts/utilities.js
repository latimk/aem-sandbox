async function getQueryIndex(url) {
  try {
    const response = await window.fetch(url);
    if (!response.ok) return null;
    const json = await response.json();
    return json;
  } catch (error) {
    console.error('Failed to get query index', { error });
  }
  return null;
}

export {
  getQueryIndex,
};
