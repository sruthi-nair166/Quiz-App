import { CloseButton, Dialog, Portal } from "@chakra-ui/react";
import styles from "../styles/Profile.module.css";
import titleCaseConverter from "../utils/titleCaseConverter";

export default function BadgeDialog({
  openBadge,
  setOpenBadge,
  badgeTitle,
  badgeSubtitle,
  badgeUrl,
  badgeDesc,
  badgeUnlocked,
}) {
  return (
    <Dialog.Root
      placement="center"
      motionPreset="slide-in-bottom"
      open={openBadge}
      onOpenChange={(isOpen) => {
        if (isOpen) setOpenBadge(isOpen.open);
      }}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content className={styles["badge-dialog"]}>
            <Dialog.Header>
              <Dialog.Title asChild>
                <div>
                  <p>{titleCaseConverter(badgeTitle)}</p>
                  <p>{titleCaseConverter(badgeSubtitle)}</p>
                </div>
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body asChild>
              <div>
                {badgeUrl && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      padding: "1rem",
                    }}
                  >
                    <div
                      className={styles["badge-buttons"]}
                      style={{ background: badgeUrl.outer }}
                    >
                      <div
                        className={styles["icon-wrapper"]}
                        style={{
                          background: badgeUrl.inner,
                        }}
                      >
                        <badgeUrl.component className={styles.icon} />
                      </div>
                    </div>
                  </div>
                )}
                <p style={{ fontSize: "1rem", paddingBottom: "0.5rem" }}>
                  {badgeUnlocked
                    ? "Unlocked!"
                    : badgeDesc?.endsWith("!")
                    ? titleCaseConverter("obtained")
                    : titleCaseConverter("not yet obtained")}
                </p>
                <p style={{ lineHeight: "1rem" }}>{badgeDesc}</p>
              </div>
            </Dialog.Body>
            <Dialog.CloseTrigger asChild>
              <CloseButton />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
