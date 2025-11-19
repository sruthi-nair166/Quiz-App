const localAvatars = import.meta.glob("../assets/avatar_img/*.png", {
  eager: true,
});
const profilePicSelect = Object.fromEntries(
  Object.entries(localAvatars).map(([path, module]) => {
    const fileName = path.split("/").pop().replace(".png", "");
    return [fileName, module.default];
  })
);

export default profilePicSelect;
