import axios from "axios";
import Vuex from "vuex";

const createStore = () => {
  return new Vuex.Store({
    state: {
      loadedPosts: [],
      token: null,
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
      setToken(state, token) {
        state.token = token;
      },
      clearToken(state) {
        state.token = null;
      },
    },
    actions: {
      nuxtServerInit(vuexContext, context) {
        return axios
          .get(process.env.baseUrl + "/posts.json")
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
        return this.$axios
          .post(
            process.env.baseUrl + "/posts.json?auth=" + context.state.token,
            createdPost
          )
          .then((res) => {
            context.commit("addPost", { ...createdPost, id: res.name });
          })
          .catch((e) => console.log(e));
      },
      editPost(context, post) {
        return this.$axios
          .$put(
            "https://nuxt-blog-2dc52-default-rtdb.asia-southeast1.firebasedatabase.app/posts/" +
              post.id +
              ".json?auth=" +
              context.state.token,
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
      authenticationUser(context, authPayload) {
        let authUrl =
          "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=";
        if (!authPayload.isLogin) {
          authUrl =
            "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=";
        }
        return this.$axios
          .$post(authUrl + process.env.fbAPIKey, {
            email: authPayload.email,
            password: authPayload.password,
            returnSecureToken: true,
          })
          .then((res) => {
            context.commit("setToken", res.idToken);
            localStorage.setItem("token", res.idToken);
            localStorage.setItem(
              "expirationTime",
              new Date().getTime() + res.expiresIn * 1000
            );
            context.dispatch("setLogoutTimer", res.expiresIn * 1000);
          })
          .catch((err) => {
            console.log(err);
          });
      },
      setLogoutTimer(context, duration) {
        setTimeout(() => {
          context.commit("clearToken", duration);
        }, duration);
      },
      initAuth(context) {
        const token = localStorage.getItem("token");
        const expirationTime = localStorage.getItem("expirationTime");

        if (new Date().getTime > expirationTime || !token) {
          return;
        }

        context.dispatch(
          "setLogoutTimer",
          +expirationTime - new Date().getTime()
        );

        context.commit("setToken", token);
      },
    },
    getters: {
      loadedPosts(state) {
        return state.loadedPosts;
      },
      isHasToken(state) {
        return state.token != null;
      },
    },
  });
};

export default createStore;
