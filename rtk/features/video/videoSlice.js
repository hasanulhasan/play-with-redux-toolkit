const { createSlice, createAsyncThunk } = require('@reduxjs/toolkit');
const fetch = require('node-fetch')
const initialState = {
  loading: false,
  videos: [],
  relatedVideos: [],
  tags: [],
  error: ''
}

const fetchVideos = createAsyncThunk('post/fetchVideos', async () => {
  const res = await fetch('http://localhost:9000/videos');
  const videos = await res.json();
  return videos;
})

const fetchByTags = createAsyncThunk('post/fetchByTags', async (tags) => {
  let queryString = '';
  if (tags?.length > 0) {
    queryString += tags.map(tag => `tags_like=${tag}`).join('&');
  }
  const res = await fetch(`http://localhost:9000/videos?${queryString}`);
  const videosWithTags = await res.json();
  console.log('related videos objects are: ', videosWithTags)
  return videosWithTags;
})

const videoSlice = createSlice({
  name: 'video',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchVideos.pending, (state) => {
      state.loading = true;
      state.error = ''
    })
    builder.addCase(fetchVideos.fulfilled, (state, action) => {
      state.loading = false;
      state.error = '';
      state.videos = action.payload;
      state.tags = action.payload.tags;
    })
    builder.addCase(fetchVideos.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message
      state.videos = action.payload
    })
    builder.addCase(fetchByTags.pending, (state) => {
      state.loading = true;
      state.error = ''
    })
    builder.addCase(fetchByTags.fulfilled, (state, action) => {
      state.loading = false;
      state.error = '';
      state.relatedVideos = action.payload
    })
    builder.addCase(fetchByTags.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message
      state.relatedVideos = action.payload
    })
  }
})

module.exports = videoSlice.reducer;
module.exports.fetchVideos = fetchVideos
module.exports.fetchByTags = fetchByTags