import axios from "axios";
import Vuex from "vuex";
import Cookies from "js-cookie";

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
            const expirationDuration =
              new Date().getTime() + Number.parseInt(res.expiresIn) * 1000;
            context.commit("setToken", res.idToken);
            localStorage.setItem("token", res.idToken);
            localStorage.setItem("expirationTime", expirationDuration);
            Cookies.set("jwt", res.idToken);
            Cookies.set("expirationDate", expirationDuration);
          })
          .catch((err) => {
            console.log(err);
          });
      },

      initAuth(context, req) {
        let token;
        let expirationDuration;
        if (req) {
          if (!req.headers.cookie) {
            return;
          }
          const jwtToken = req.headers.cookie
            .split(";")
            .find((c) => c.trim().startsWith("jwt="));
          const expirationToken = req.headers.cookie
            .split(";")
            .find((c) => c.trim().startsWith("expirationDate="));
          if (!jwtToken || !expirationToken) {
            return;
          }

          token = jwtToken.split("=")[1];
          expirationDuration = expirationToken.split("=")[1];
        } else {
          token = localStorage.getItem("token");
          expirationDuration = localStorage.getItem("expirationTime");
        }
        if (new Date().getTime() > +expirationDuration || !token) {
          console.log("No token or invalid Token");
          context.dispatch("logout");
          return;
        }
        context.commit("setToken", token);
      },

      logout(context) {
        context.commit("clearToken");
        Cookies.remove("jwt");
        Cookies.remove("expirationDateF");
        localStorage.removeItem("token");
        localStorage.removeItem("expirationTime");
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
