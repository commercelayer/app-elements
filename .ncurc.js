module.exports = {
  dep: ["prod", "dev", "optional", "packageManager"],
  deep: true,
  upgrade: true,
  reject: ["pnpm"],
  filterResults: (name, { upgradedVersionSemver }) => {
    if (
      (name === "@types/node" &&
        parseInt(upgradedVersionSemver?.major) >= 22) ||
      (name === "tailwindcss" && parseInt(upgradedVersionSemver?.major) >= 4) ||
      (name === "zod" && parseInt(upgradedVersionSemver?.major) >= 4) ||
      (name === "@hookform/resolvers" &&
        parseInt(upgradedVersionSemver?.major) >= 4)
    ) {
      return false
    }

    return true
  },
}
