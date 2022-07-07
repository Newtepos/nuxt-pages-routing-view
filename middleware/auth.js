export default function (context) {
    if (!context.store.getters.isHasToken) {
      context.redirect({ path: "/admin/auth" });
    }

}
