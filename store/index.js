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
    },
    actions: {
      nuxtServerInit(vuexContext, context) {
        return axios
          .get(
            "https://nuxt-blog-2dc52-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json"
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
