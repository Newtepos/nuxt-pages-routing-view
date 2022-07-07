import axios from "axios";
import Vuex from "vuex";

const createStore = () => {
  return new Vuex.Store({
    state: {
      loadedPosts: [],
    },
    mutations: {
      setPosts(state, posts) {
        state.loadedPosts = posts;
      },
      addPost(state, post) {
        state.loadedPosts.push(post);
      },
      editPost(state, editedPost) {
        const postIndex = state.loadedPosts.findIndex(
          (post) => post.id === editedPost.id
        );
        state.loadedPosts[postIndex] = editedPost;
      },
    },
    actions: {
      nuxtServerInit(vuexContext, context) {
        return axios
          .get(
            process.env.baseUrl + "/posts.json"
          )
          .then((res) => {
            const postsArrays = [];
            for (const key in res.data) {
              postsArrays.push({ ...res.data[key], id: key });
            }
            vuexContext.commit("setPosts", postsArrays);
          })
          .catch((e) => console.log(e));
      },
      addPost(context, post) {
        const createdPost = {
          ...post,
          updatedDate: new Date(),
        };
        return axios
          .post(
            process.env.baseUrl + "/posts.json",
            createdPost
          )
          .then((res) => {
            context.commit("addPost", { ...createdPost, id: res.data.name });
          })
          .catch((e) => console.log(e));
      },
      editPost(context, post) {
        return axios
          .put(
            "https://nuxt-blog-2dc52-default-rtdb.asia-southeast1.firebasedatabase.app/posts/" +
              post.id +
              ".json",
            post
          )
          .then((res) => {
            context.commit("editPost", {
              ...post,
              id: post.id,
            });
          });
      },
      setPosts(context, posts) {
        context.commit("setPosts", posts);
      },
    },
    getters: {
      loadedPosts(state) {
        return state.loadedPosts;
      },
    },
  });
};

export default createStore;
