<template>
  <div class="admin-post-page">
    <section class="update-form">
      <AdminPostForm :post="loadedPost" @submit="onSubmitted" />
    </section>
  </div>
</template>

<script>
import axios from "axios";
import AdminPostForm from "~/components/Admin/AdminPostForm.vue";
export default {
  layout: "admin",
  components: {
    AdminPostForm,
  },
  async asyncData(context) {
    // return axios
    //   .get(
    //     "https://nuxt-blog-2dc52-default-rtdb.asia-southeast1.firebasedatabase.app/posts/" +
    //       context.params.id +
    //       ".json"
    //   )
    //   .then((res) => {
    //     return {
    //       loadedPost: res.data,
    //     };
    //   })
    //   .catch((e) => console.log(e));
    const res = await axios.get(
      "https://nuxt-blog-2dc52-default-rtdb.asia-southeast1.firebasedatabase.app/posts/" +
        context.params.postId +
        ".json"
    );

    return { loadedPost: { ...res.data, id: context.params.postId } };
  },
  methods: {
    onSubmitted(editedPost) {
      // axios
      //   .put(
      //     "https://nuxt-blog-2dc52-default-rtdb.asia-southeast1.firebasedatabase.app/posts/" +
      //       this.$route.params.postId +
      //       ".json",
      //     editedPost
      //   )
      //   .then((res) => {
      //     this.$router.push("/admin");
      //   });
      this.$store
        .dispatch("editPost", editedPost)
        .then(() => this.$router.push("/admin"));
    },
  },
};
</script>

<style scoped>
.update-form {
  width: 90%;
  margin: 20px auto;
}
@media (min-width: 768px) {
  .update-form {
    width: 500px;
  }
}
</style>
