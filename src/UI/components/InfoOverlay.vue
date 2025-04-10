<script setup>
import { ref, watch, onMounted, nextTick } from "vue";
import MuteToggle from "./MuteToogle.vue";
import FreeCamToggle from "./FreeCamToogle.vue";

const props = defineProps({
  visible: Boolean,
});

const NAME_TEXT = "Christian Carrasco";
const TITLE_TEXT = "Full Stack Developer";
const MULTIPLIER = 1;

const nameText = ref("");
const titleText = ref("");
const timeText = ref("");
const time = ref(new Date().toLocaleTimeString());
const textDone = ref(false);
const volumeVisible = ref(false);
const freeCamVisible = ref(false);
const visRef = ref(props.visible);
const timeRef = ref(time.value);

const typeText = async (i, curText, text, setText, callback, refOverride) => {
  if (refOverride) {
    text = refOverride.value;
  }
  if (i < text.length) {
    setTimeout(() => {
      if (visRef.value === true) {
        window.postMessage({ type: "keydown", key: `_AUTO_${text[i]}` }, "*");
      }

      setText.value = curText + text[i];
      typeText(i + 1, curText + text[i], text, setText, callback, refOverride);
    }, Math.random() * 50 + 50 * MULTIPLIER);
  } else {
    callback();
  }
};

watch(
  () => props.visible,
  (newVal) => {
    if (newVal && nameText.value === "") {
      setTimeout(() => {
        typeText(0, "", NAME_TEXT, nameText, () => {
          typeText(0, "", TITLE_TEXT, titleText, () => {
            typeText(
              0,
              "",
              time.value,
              timeText,
              () => {
                textDone.value = true;
              },
              timeRef
            );
          });
        });
      }, 400);
    }
    visRef.value = newVal;
  }
);

watch(textDone, (done) => {
  if (done) {
    setTimeout(() => {
      volumeVisible.value = true;
      setTimeout(() => {
        freeCamVisible.value = true;
      }, 250);
    }, 250);
  }
});

onMounted(() => {
  setInterval(() => {
    time.value = new Date().toLocaleTimeString();
    timeRef.value = time.value;
    if (textDone.value) {
      timeText.value = time.value;
    }
  }, 1000);
});
</script>

<template>
  <div class="absolute flex flex-col w-full items-start justify-start">
    <div
      v-if="nameText !== ''"
      class="bg-black px-4! py-1! text-center flex mb-1! box-border"
    >
      <p>{{ nameText }}</p>
    </div>
    <div
      v-if="titleText !== ''"
      class="bg-black px-4! py-1! text-center flex mb-1! box-border"
    >
      <p>{{ titleText }}</p>
    </div>
    <div v-if="timeText !== ''" class="flex flex-row">
      <div class="bg-black px-4! py-1! text-center flex mb-1! box-border mr-1!">
        <p>{{ timeText }}</p>
      </div>
      <div v-if="volumeVisible" class="mr-1!">
        <MuteToggle />
      </div>
      <div v-if="freeCamVisible" class="mr-1!">
        <FreeCamToggle />
      </div>
    </div>
  </div>
</template>
