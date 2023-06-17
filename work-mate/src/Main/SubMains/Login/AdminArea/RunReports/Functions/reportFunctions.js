
export async function getDailyFigures (UserContext) {
    const ip = UserContext;
    let todaysFigures = "";
    try {
        const response = await fetch(`${ip[5]}${ip[4]}:3001/grabDailyFigures`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
          })
        });
        //awaiting response from the server.
        const data = await response.json();
        todaysFigures = data;
        } catch (error) {
        console.log(error);
        }
        return todaysFigures;
};
export async function getWeekFigures (UserContext) {
  const ip = UserContext;
  let todaysFigures = "";
  try {
      const response = await fetch(`${ip[5]}${ip[4]}:3001/grabDailyFigures7`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
        })
      });
      //awaiting response from the server.
      const data = await response.json();
      todaysFigures = data;
      } catch (error) {
      console.log(error);
      }
      return todaysFigures;
};
export async function fetchRegions (UserContext) {
  const ip = UserContext;
  const response = await fetch(`${ip[5]}${ip[4]}:3333/grabRegions`,{
    method: "POST",
    headers: {
      "Content-Type":"application/json"
    },
    body:JSON.stringify({
    })
    })
    const data = await response.json()
    return data
}

export async function fetchAvailableStores (UserContext, region) {
  const ip = UserContext;
  const response = await fetch(`${ip[5]}${ip[4]}:3001/fetchAvailableStores`,{
    method: "POST",
    headers: {
      "Content-Type":"application/json"
    },
    body:JSON.stringify({
      region: region
    })
    })
    const data = await response.json()
    return data
}
export async function fetchUniqueStoreData (UserContext, region,store,time) {
  const ip = UserContext;
  const response = await fetch(`${ip[5]}${ip[4]}:3001/fetchUniqueStoreData`,{
    method: "POST",
    headers: {
      "Content-Type":"application/json"
    },
    body:JSON.stringify({
      region: region,
      store: store,
      time:time
    })
    })
    const data = await response.json()
    return data
}