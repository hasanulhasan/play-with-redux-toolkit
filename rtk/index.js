const store = require('./app/store');
const { fetchVideos, fetchByTags } = require('./features/video/videoSlice')

store.subscribe(() => {
  console.log(store.getState());
})

store.dispatch(fetchVideos()).then(() => {
  const state = store.getState();
  store.dispatch(fetchByTags(state.video.tags))
});
