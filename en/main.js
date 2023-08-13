// initializing
const jsPsych = initJsPsych({
  display_element: "display_stage",
  experiment_width: 1100,
  default_iti: 400,
  on_finish: function () {
    var datajs = jsPsych.data.get().json();
    Qualtrics.SurveyEngine.setEmbeddedData("pw", password);
    Qualtrics.SurveyEngine.setEmbeddedData("c1", assignment_c1);
    Qualtrics.SurveyEngine.setEmbeddedData("c2", assignment_c2);
    Qualtrics.SurveyEngine.setEmbeddedData("t1", topic_1);
    Qualtrics.SurveyEngine.setEmbeddedData("t2", topic_2);
    Qualtrics.SurveyEngine.setEmbeddedData("datajs", datajs);
    jQuery("#display_stage").remove();
    jQuery("#display_stage_background").remove();
  },
});

// next button
const next_text = "To the next page";

// image
const img_hourglass =
  "https://kai21rilh.github.io/experiment_mc05/en/img/hourglass_animated.gif";

// define local functions
const make_order = function (number) {
  let new_array = [];
  for (var i = 0; i < number; i++) {
    new_array.push(i);
  }
  let new_array_2 = jsPsych.randomization.shuffle(new_array);
  return new_array_2;
};

const make_qs = function (items, order, start, end, scale, names) {
  const new_qs = [];
  for (var i = start - 1; i < end; i++) {
    new_qs.push({
      prompt: '<p style="text-align:left">' + items[order[i]] + "</p>",
      labels: scale,
      name: names[order[i]],
      required: true,
    });
  }
  return new_qs;
};

const make_block = function (inst, qs) {
  let new_block = {
    type: jsPsychSurveyLikert,
    preamble: '<p style="text-align:left">' + inst + "</p>",
    questions: qs,
    randomize_question_order: false,
    button_label: next_text,
  };
  return new_block;
};

// Password
const password = jsPsych.randomization.randomInt(10000, 99999);

// loading
const preload = {
  type: jsPsychPreload,
  auto_preload: true,
};

// introduction
const intro = {
  type: jsPsychFullscreen,
  fullscreen_mode: true,
  message:
    "<p>Connected to the server.<br><br>Please press the button below to proceed.</p>",
  button_label: next_text,
};

// demographics
const age = {
  type: jsPsychSurveyText,
  preamble: "First, please answer the questions about yourself.",
  questions: [
    {
      prompt: "What is your age?",
      name: "age",
      columns: 30,
      required: true,
    },
  ],
  button_label: next_text,
};

const sex = {
  type: jsPsychSurveyLikert,
  preamble: "First, please answer the questions about yourself.",
  questions: [
    {
      prompt: "What is your sex?",
      labels: ["male", "female", "other"],
      name: "sex",
      required: true,
    },
  ],
  scale_width: 600,
  randomize_question_order: false,
  button_label: next_text,
};

const race = {
  type: jsPsychSurveyLikert,
  preamble: "First, please answer the questions about yourself.",
  questions: [
    {
      prompt: "What is your race?",
      labels: [
        "White",
        "Black or<br>African American",
        "Asian",
        "Pacific Islander",
        "Of Hispanic, Latino,<br>or Spanish origin",
        "American Indian or<br>Alaska Native",
        "Some other race",
      ],
      name: "race",
      required: true,
    },
  ],
  randomize_question_order: false,
  button_label: next_text,
};

// ideology
const scale_ideology = [
  "1<br>strong<br>liberal",
  "2<br><br>liberal",
  "3<br>somewhat<br>liberal",
  "4<br><br>neutral",
  "5<br>somewhat<br>conservative",
  "6<br><br>conservative",
  "7<br>strong<br>conservative",
];

const inst_ideology =
  'People sometimes use the classification of "conservative-liberal" for differences in views on social and economic issues. Please read the following questions and choose the number that most closely matches your position.';

const items_ideology = [
  // social
  '<b><u>On social issues such as the environment and human rights</u></b><br>Suppose we define "conservative" as a position that emphasizes traditional values and desires stability rather than radical change while defining "liberal" as a position that emphasizes reform rather than maintaining the status quo and seeks to improve the status of the weak. Do you consider yourself socially conservative or liberal?',
  // economic
  '<b><u>On economic matters</u></b><br>Suppose we define "conservative" as a position that favors free economic activity based on the principle of competition while defining "liberal" as a position that favors equal distribution of wealth based on, for example, government regulation. Do you consider yourself economically conservative or liberal?',
];

const names_ideology = ["socioid", "econoid"];

// create blocks
let order_ideology = make_order(items_ideology.length);

let qs_ideology = {};
let ideology_block = {};
let timeline_ideology = [];
for (var i = 0; i < items_ideology.length; i++) {
  qs_ideology[i] = make_qs(
    (items = items_ideology),
    (order = order_ideology),
    (start = i + 1),
    (end = i + 1),
    (scale = scale_ideology),
    (names = names_ideology)
  );
  ideology_block[i] = make_block((inst = inst_ideology), (qs = qs_ideology[i]));
  timeline_ideology.push(ideology_block[i]);
}

const ideology_blocks = {
  timeline: timeline_ideology,
};

// pairing
const pairing_start = {
  type: jsPsychHtmlButtonResponse,
  stimulus:
    "You will now be paired with another person.<br>Your partner will be randomly chosen from the current participants in this experiment.<br><br>Please press the button below when you are ready.<br><br>" +
    '<font color="#c00000"><i>*If nobody is on this server, you will not be paired with another participant.<br>In that case, please access it again later. We apologize for the inconvenience.</i></font>',
  choices: ["Find your partner"],
  post_trial_gap: 1000,
};

// waiting period
var wp = jsPsych.randomization.randomInt(15000, 20000);
const hourglass = {
  type: jsPsychImageKeyboardResponse,
  stimulus: img_hourglass,
  stimulus_width: 240,
  stimulus_height: 180,
  maintain_aspect_ratio: false,
  render_on_canvas: false,
  prompt:
    '<p>Now searching your partner. Please wait a moment...</p><p style="color:#c00000"><i>*If it does not proceed to the next page in 30 seconds, please access it again later.</i></p>',
  choices: "NO_KEYS",
  trial_duration: wp,
  post_trial_gap: 5000,
};

// nickname setting
const nickname_self = {
  type: jsPsychSurveyLikert,
  preamble:
    'You have been paired with another participant successfully.<br><br>As you are informed in the introduction, you will participate in several tasks with your partner.<br>First, please choose <b>your nickname</b> to be used in the experiment.<br><br><font color="#c00000"><i>*To avoid duplication, you and your partner are provided different sets of nicknames as options.</i></font>',
  questions: [
    {
      prompt: "Which nickname would you prefer to use?",
      labels: ["William", "Olivia", "James", "Sophia"],
      name: "nickname_self",
      required: true,
    },
  ],
  scale_width: 800,
  randomize_question_order: false,
  button_label: next_text,
  post_trial_gap: 1000,
};

// show nickname
const nickname_info = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: function () {
    var resp = jsPsych.data.get().last(1).values()[0].response.nickname_self;
    if (resp == 0) {
      var chosen_nn = "William";
    } else if (resp == 1) {
      var chosen_nn = "Olivia";
    } else if (resp == 2) {
      var chosen_nn = "James";
    } else if (resp == 3) {
      var chosen_nn = "Sophia";
    }
    return (
      'The nicknames have been set. Your nickname is "<b>' +
      chosen_nn +
      '</b>," and your partner\'s is "<b>John</b>."<br>Please remember the nicknames since we will refer to you and your partner in the experiment with these names.<br><br><font color="#c00000"><i>*It will proceed to the next page after 10 seconds.</i></font>'
    );
  },
  choices: "NO_KEYS",
  trial_duration: 10000,
};

// judgment task
// preambles, sentences, and scale
const inst_q1 =
  "Please read the following question and choose the number that most closely matches your position.";

const inst_q2 =
  "Please read the following instructions carefully and fill in the blank below.";

const ifood_sentence =
  "Do you want to start buying insects as your regular food if they become available at your local supermarket?";

const aitech_sentence =
  "Do you want to actively incorporate AI technology into various domains of your daily life?";

const scale_q1_ifood = [
  "1<br>Absolutely<br>No",
  "2<br><br>No",
  "3<br>Possibly<br>No",
  "4<br>Possibly<br>Yes",
  "5<br><br>Yes",
  "6<br>Absolutely<br>Yes",
];

const scale_q1_aitech = [
  "1<br>Absolutely<br>No",
  "2<br><br>No",
  "3<br>Possibly<br>No",
  "4<br>Possibly<br>Yes",
  "5<br><br>Yes",
  "6<br>Absolutely<br>Yes",
];

const labels_q1_ifood = [
  "Absolutely No",
  "No",
  "Possibly No",
  "Possibly Yes",
  "Yes",
  "Absolutely Yes",
];

const labels_q1_aitech = [
  "Absolutely No",
  "No",
  "Possibly No",
  "Possibly Yes",
  "Yes",
  "Absolutely Yes",
];

// topic
const ifood_self =
  '<p style="text-align:left"><b>Your answer:</b><br><u>Do you want to buy insects as your regular food?</u>';

const aitech_self =
  '<p style="text-align:left"><b>Your answer:</b><br><u>Q1. Do you want to incorporate AI technology into your daily life?</u>';

// condition
const positive_nonmoral_ifood =
  "<u>Do you want to buy insects as your regular food?</u><br>6 (Absolutely Yes)<br><u>Q2. What do you think about insects as human food?</u><br>I have tried insects before and found them very tasty. If they became available in my daily life, I would be very happy to buy them.";

const positive_moral_ifood =
  "<u>Do you want to buy insects as your regular food?</u><br>6 (Absolutely Yes)<br><u>Q2. What do you think about insects as human food?</u><br>Since the future of food production is uncertain, humans will be obligated to eat insects. We should start eating them now so we can adapt to them.";

const negative_nonmoral_ifood =
  "<u>Do you want to buy insects as your regular food?</u><br>1 (Absolutely No)<br><u>Q2. What do you think about insects as human food?</u><br>I have tried insects before, but I did not like the taste of them at all. I would never try them again, even if I had an opportunity.";

const negative_moral_ifood =
  "<u>Do you want to buy insects as your regular food?</u><br>1 (Absolutely No)<br><u>Q2. What do you think about insects as human food?</u><br>It is wrong to eat INSECTS when there are so many other things we can choose to eat. It is against human nature. We are not reptiles.";

const positive_nonmoral_aitech =
  "<u>Q1. Do you want to incorporate AI technology into your daily life?</u><br>6 (Absolutely Yes)<br><u>Q2. What do you think about AI technology?</u><br>AI technology saves a lot of time on various tasks and is very efficient. I want to incorporate it into my daily life actively.";

const positive_moral_aitech =
  "<u>Q1. Do you want to incorporate AI technology into your daily life?</u><br>6 (Absolutely Yes)<br><u>Q2. What do you think about AI technology?</u><br>People who cannot adapt to AI technology will not be able to survive shortly. I believe it is our responsibility to get familiar with it.";

const negative_nonmoral_aitech =
  "<u>Q1. Do you want to incorporate AI technology into your daily life?</u><br>1 (Absolutely No)<br><u>Q2. What do you think about AI technology?</u><br>AI technology might be useful for a more efficient life. However, I don't find it appealing because I prefer opportunities to think and work for myself.";

const negative_moral_aitech =
  "<u>Q1. Do you want to incorporate AI technology into your daily life?</u><br>1 (Absolutely No)<br><u>Q2. What do you think about AI technology?</u><br>AI technology is like a drug that will make us dependent on it. We must not rely on it, or it will destroy our ability to think for ourselves.";

// manipulation (condition)
// define levels
const levels_c1 = ["match", "mismatch"];
const levels_c2 = ["moral", "nonmoral"];
// define assignment (array output)
const result_c1 = jsPsych.randomization.sampleWithoutReplacement(
  (array = levels_c1),
  (sampleSize = 1)
);
const result_c2 = jsPsych.randomization.sampleWithoutReplacement(
  (array = levels_c2),
  (sampleSize = 1)
);
// convert to string
const assignment_c1 = result_c1.toString();
const assignment_c2 = result_c2.toString();

// manipulation (counterbalance)
// define levels
const levels_topic = ["insect_food", "ai_tech"];
const result_topic = jsPsych.randomization.sampleWithoutReplacement(
  (array = levels_topic),
  (sampleSize = 2)
);
const topic_1 = result_topic[0].toString();
const topic_2 = result_topic[1].toString();

// function
const make_summary = function (topic) {
  let new_summary = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function () {
      if (topic == "insect_food") {
        // define responses
        var response_q1 =
          jsPsych.data.get().last(3).values()[0].response.judgment_ifood_q1 + 1;
        var response_q2 = jsPsych.data.get().last(2).values()[0]
          .response.judgment_ifood_q2;
        // stimulus (common parts)
        var stim_a =
          '<p style="text-align:left">Below are the answers from you and John.</p><br>' +
          ifood_self +
          "<br>" +
          response_q1 +
          "（" +
          labels_q1_ifood[response_q1 - 1] +
          "）<br>" +
          "<u>Q2. What do you think about insects as human food?</u><br>" +
          response_q2 +
          "</p><br>" +
          '<p style="text-align:left"><b>John\'s answer:</b><br>';
        var stim_b =
          "</p>" +
          '<font color="#c00000"><br><br><i>*It will proceed to the next page after 30 seconds.</i></font>';
        // branch
        if (assignment_c1 == "match" && assignment_c2 == "nonmoral") {
          if (response_q1 <= 3) {
            var stim = stim_a + negative_nonmoral_ifood + stim_b;
          }
          if (response_q1 >= 4) {
            var stim = stim_a + positive_nonmoral_ifood + stim_b;
          }
        }
        if (assignment_c1 == "match" && assignment_c2 == "moral") {
          if (response_q1 <= 3) {
            var stim = stim_a + negative_moral_ifood + stim_b;
          }
          if (response_q1 >= 4) {
            var stim = stim_a + positive_moral_ifood + stim_b;
          }
        }
        if (assignment_c1 == "mismatch" && assignment_c2 == "nonmoral") {
          if (response_q1 <= 3) {
            var stim = stim_a + positive_nonmoral_ifood + stim_b;
          }
          if (response_q1 >= 4) {
            var stim = stim_a + negative_nonmoral_ifood + stim_b;
          }
        }
        if (assignment_c1 == "mismatch" && assignment_c2 == "moral") {
          if (response_q1 <= 3) {
            var stim = stim_a + positive_moral_ifood + stim_b;
          }
          if (response_q1 >= 4) {
            var stim = stim_a + negative_moral_ifood + stim_b;
          }
        }
      }
      if (topic == "ai_tech") {
        // define responses
        var response_q1 =
          jsPsych.data.get().last(3).values()[0].response.judgment_aitech_q1 +
          1;
        var response_q2 = jsPsych.data.get().last(2).values()[0]
          .response.judgment_aitech_q2;
        // stimulus (common parts)
        var stim_a =
          '<p style="text-align:left">Below are the answers from you and John.</p><br>' +
          aitech_self +
          "<br>" +
          response_q1 +
          "（" +
          labels_q1_aitech[response_q1 - 1] +
          "）<br>" +
          "<u>Q2. What do you think about AI technology?</u><br>" +
          response_q2 +
          "</p><br>" +
          '<p style="text-align:left"><b>John\'s answer:</b><br>';
        var stim_b =
          "</p>" +
          '<font color="#c00000"><br><br><i>*It will proceed to the next page after 30 seconds.</i></font>';
        // branch
        if (assignment_c1 == "match" && assignment_c2 == "nonmoral") {
          if (response_q1 <= 3) {
            var stim = stim_a + negative_nonmoral_aitech + stim_b;
          }
          if (response_q1 >= 4) {
            var stim = stim_a + positive_nonmoral_aitech + stim_b;
          }
        }
        if (assignment_c1 == "match" && assignment_c2 == "moral") {
          if (response_q1 <= 3) {
            var stim = stim_a + negative_moral_aitech + stim_b;
          }
          if (response_q1 >= 4) {
            var stim = stim_a + positive_moral_aitech + stim_b;
          }
        }
        if (assignment_c1 == "mismatch" && assignment_c2 == "nonmoral") {
          if (response_q1 <= 3) {
            var stim = stim_a + positive_nonmoral_aitech + stim_b;
          }
          if (response_q1 >= 4) {
            var stim = stim_a + negative_nonmoral_aitech + stim_b;
          }
        }
        if (assignment_c1 == "mismatch" && assignment_c2 == "moral") {
          if (response_q1 <= 3) {
            var stim = stim_a + positive_moral_aitech + stim_b;
          }
          if (response_q1 >= 4) {
            var stim = stim_a + negative_moral_aitech + stim_b;
          }
        }
      }
      return stim;
    },
    choices: "NO_KEYS",
    trial_duration: 30000,
  };
  return new_summary;
};

// instruction
const judgment_inst = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus:
    'Before proceeding to the "pair task," you will participate in a "judgment task."<br><br>' +
    "In this task, you and John will answer the same questions on the two topics.<br>After that, you can see and compare each other's responses.<br><u>This task is conducted to have some knowledge about each other's ways of thinking.</u><br><br>" +
    '<font color="#c00000"><i>*The judgment task will automatically start after 20 seconds. Please wait a moment...</i></font>',
  choices: "NO_KEYS",
  trial_duration: 20000,
};

// topic: insect_food
const judgment_ifood = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<p style="font-size:16pt"><b>Topic: Insects as human food</b></p>',
  choices: "NO_KEYS",
  trial_duration: 3000,
};

// Q1
const judgment_ifood_q1 = {
  type: jsPsychSurveyLikert,
  preamble: '<p style="text-align:left">' + inst_q1 + "</p>",
  questions: [
    {
      prompt: '<p style="text-align:left">' + ifood_sentence + "</p>",
      labels: scale_q1_ifood,
      name: "judgment_ifood_q1",
      required: true,
    },
  ],
  randomize_question_order: false,
  button_label: next_text,
};

// Q2
const judgment_ifood_q2 = {
  type: jsPsychSurveyText,
  preamble: inst_q2,
  questions: [
    {
      prompt:
        "Please briefly share your thoughts on insects as human food with John.<br>(e.g., The reason why you feel positively or negatively about them)",
      placeholder: "Please describe in about 1 ~ 1.5 lines within this box.",
      name: "judgment_ifood_q2",
      rows: 3,
      columns: 90,
      required: true,
    },
  ],
  button_label: next_text,
};

// waiting period
const rt_partner_ifood = jsPsych.randomization.randomInt(85000, 95000);
const hourglass_ifood = {
  type: jsPsychImageKeyboardResponse,
  stimulus: img_hourglass,
  stimulus_width: 240,
  stimulus_height: 180,
  maintain_aspect_ratio: false,
  render_on_canvas: false,
  prompt: "<p>John is writing now. Please wait a moment...</p>",
  choices: "NO_KEYS",
  trial_duration: function () {
    var rt_participant_ifood = jsPsych.data.get().last(1).values()[0].rt;
    if (time_left_ifood < 1) {
      var time_left_ifood = 1;
    } else {
      var time_left_ifood = rt_partner_ifood - rt_participant_ifood;
    }
    return time_left_ifood;
  },
  post_trial_gap: 3000,
};

// result summary
const summary_ifood = make_summary((topic = "insect_food"));

// follow-up questions
const followup_inst_ifood = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus:
    "The judgment task on insects as human food has been completed.<br>Before proceeding, please answer some follow-up questions on the current topic.<br><u>Note that your answers to the follow-up questions will not be shown to John.</u><br><br>" +
    '<font color="#c00000"><i>*It will proceed to the next page after 10 seconds.</i></font>',
  choices: "NO_KEYS",
  trial_duration: 10000,
};

// follow-up 1 (Moral conviction)
const scale_mc = [
  "1<br>not at all",
  "2<br>slightly",
  "3<br>moderately",
  "4<br>much",
  "5<br>very much",
];

const inst_mc =
  "Please answer the following questions by selecting the number that best describes your idea.";

const items_mc = [
  "To what extent is <b>your</b> position on this topic a reflection of your core moral beliefs and convictions?",
  "To what extent is <b>your</b> position on this topic connected to your beliefs about fundamental right and wrong?",
];

const mc1_ifood = {
  type: jsPsychSurveyLikert,
  preamble: '<p style="text-align:left">' + inst_mc + "</p>",
  questions: [
    {
      prompt: '<p style="text-align:left">' + items_mc[0] + "</p>",
      labels: scale_mc,
      name: "mc1_ifood",
      required: true,
    },
  ],
  randomize_question_order: false,
  button_label: next_text,
};

const mc2_ifood = {
  type: jsPsychSurveyLikert,
  preamble: '<p style="text-align:left">' + inst_mc + "</p>",
  questions: [
    {
      prompt: '<p style="text-align:left">' + items_mc[1] + "</p>",
      labels: scale_mc,
      name: "mc2_ifood",
      required: true,
    },
  ],
  randomize_question_order: false,
  button_label: next_text,
};

const timeline_mc_ifood = jsPsych.randomization.shuffle([mc1_ifood, mc2_ifood]);
const mc_blocks_ifood = { timeline: timeline_mc_ifood };

// follow-up 2 (Perceived moral conviction)
const items_pmc = [
  "To what extent do you think <b>John's</b> position on this topic is a reflection of his core moral beliefs and convictions?",
  "To what extent do you think <b>John's</b> position on this topic is connected to his beliefs about fundamental right and wrong?",
];

const pmc1_ifood = {
  type: jsPsychSurveyLikert,
  preamble: '<p style="text-align:left">' + inst_mc + "</p>",
  questions: [
    {
      prompt: '<p style="text-align:left">' + items_pmc[0] + "</p>",
      labels: scale_mc,
      name: "pmc1_ifood",
      required: true,
    },
  ],
  randomize_question_order: false,
  button_label: next_text,
};

const pmc2_ifood = {
  type: jsPsychSurveyLikert,
  preamble: '<p style="text-align:left">' + inst_mc + "</p>",
  questions: [
    {
      prompt: '<p style="text-align:left">' + items_pmc[1] + "</p>",
      labels: scale_mc,
      name: "pmc2_ifood",
      required: true,
    },
  ],
  randomize_question_order: false,
  button_label: next_text,
};

const timeline_pmc_ifood = jsPsych.randomization.shuffle([
  pmc1_ifood,
  pmc2_ifood,
]);
const pmc_blocks_ifood = { timeline: timeline_pmc_ifood };

// follow-up 3 (interest)
const inst_interest =
  "Please answer the following question by selecting the number that best describes your idea.";

const scale_interest = [
  "1<br>not at all<br>interested",
  "2",
  "3",
  "4<br>moderately<br>interested",
  "5",
  "6",
  "7<br>very much<br>interested",
];

const interest_ifood = {
  type: jsPsychSurveyLikert,
  preamble: '<p style="text-align:left">' + inst_interest + "</p>",
  questions: [
    {
      prompt:
        '<p style="text-align:left">' +
        "How interested are you in this topic, whether you adopt it as a regular food or not?" +
        "</p>",
      labels: scale_interest,
      name: "interest_ifood",
      required: true,
    },
  ],
  randomize_question_order: false,
  button_label: next_text,
};

// follow-up 4 (perceived similarity)
const inst_p_similarity =
  "Please answer the following question by selecting the number that best describes your idea.";

const scale_p_similarity = [
  "1<br>not at all<br>similar",
  "2<br>slightly<br>similar",
  "3<br>moderately<br>similar",
  "4<br>very<br>similar",
  "5<br>very much<br>similar",
];

const p_similarity_ifood = {
  type: jsPsychSurveyLikert,
  preamble: '<p style="text-align:left">' + inst_p_similarity + "</p>",
  questions: [
    {
      prompt:
        '<p style="text-align:left">' +
        "To what extent do you think is John's answer similar to yours?" +
        "</p>",
      labels: scale_p_similarity,
      name: "p_similarity_ifood",
      required: true,
    },
  ],
  randomize_question_order: false,
  button_label: next_text,
};

// follow-up 5 (emotionality)
const inst_emotionality =
  "Please answer the following question by selecting the number that best describes your idea.";

const scale_emotionality = [
  "1<br>very weak",
  "2",
  "3",
  "4<br>moderate",
  "5",
  "6",
  "7<br>very strong",
];

const emotionality_ifood = {
  type: jsPsychSurveyLikert,
  preamble: '<p style="text-align:left">' + inst_emotionality + "</p>",
  questions: [
    {
      prompt:
        '<p style="text-align:left">' +
        "In your opinion, how strong are <b>John's emotions</b> about this topic?" +
        "</p>",
      labels: scale_emotionality,
      name: "emotionality_ifood",
      required: true,
    },
  ],
  randomize_question_order: false,
  button_label: next_text,
};

// follow-up 6 (TF question)
const inst_tf =
  "Please read the following statement and choose the correct option.";

const tf_ifood = {
  type: jsPsychSurveyLikert,
  preamble: '<p style="text-align:left">' + inst_tf + "</p>",
  questions: [
    {
      prompt:
        '<p style="text-align:left">' +
        "John is willing to adopt insects as a regular food." +
        "</p>",
      labels: ["True", "False"],
      name: "tf_ifood",
      required: true,
    },
  ],
  randomize_question_order: false,
  button_label: next_text,
};

// follow-up 7 (attention checks)
const scale_ac = [
  "1<br>strongly<br>disagree",
  "2",
  "3",
  "4<br>neither agree<br>nor disagree",
  "5",
  "6",
  "7<br>strongly<br>agree",
];

const inst_ac =
  "Please answer the following question by selecting the number that best describes your idea.";

const ac_ifood = {
  type: jsPsychSurveyLikert,
  preamble: '<p style="text-align:left">' + inst_ac + "</p>",
  questions: [
    {
      prompt:
        '<p style="text-align:left">' +
        "This is an attention check item. Please respond to this item by selecting 6." +
        "</p>",
      labels: scale_ac,
      name: "ac_ifood",
      required: true,
    },
  ],
  randomize_question_order: false,
  button_label: next_text,
};

const followup_ifood = [
  mc_blocks_ifood,
  pmc_blocks_ifood,
  interest_ifood,
  p_similarity_ifood,
  emotionality_ifood,
];

const timeline_followup_ifood = jsPsych.randomization.sampleWithoutReplacement(
  (array = followup_ifood),
  (sampleSize = 5)
);

timeline_followup_ifood.splice(2, 0, tf_ifood);
timeline_followup_ifood.splice(5, 0, ac_ifood);

const followup_blocks_ifood = {
  timeline: timeline_followup_ifood,
};

const followup_end_ifood = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus:
    "The follow-up questions have been completed.<br><br>" +
    '<font color="#c00000"><i>*It will proceed to the next page after 5 seconds.</i></font>',
  choices: "NO_KEYS",
  trial_duration: 5000,
};

// save as a block
const block_ifood = {
  timeline: [
    judgment_ifood,
    judgment_ifood_q1,
    judgment_ifood_q2,
    hourglass_ifood,
    summary_ifood,
    followup_inst_ifood,
    followup_blocks_ifood,
    followup_end_ifood,
  ],
};

// topic 2: AI technology
const judgment_aitech = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<p style="font-size:16pt"><b>Topic: AI technology</b></p>',
  choices: "NO_KEYS",
  trial_duration: 3000,
};

// Q1
const judgment_aitech_q1 = {
  type: jsPsychSurveyLikert,
  preamble: '<p style="text-align:left">' + inst_q1 + "</p>",
  questions: [
    {
      prompt: '<p style="text-align:left">' + aitech_sentence + "</p>",
      labels: scale_q1_aitech,
      name: "judgment_aitech_q1",
      required: true,
    },
  ],
  randomize_question_order: false,
  button_label: next_text,
};

// Q2
const judgment_aitech_q2 = {
  type: jsPsychSurveyText,
  preamble: inst_q2,
  questions: [
    {
      prompt:
        "Please briefly share your thoughts on AI technology with John.<br>(e.g., The reason why you feel positively or negatively about it)",
      placeholder: "Please describe in about 1 ~ 1.5 lines within this box.",
      name: "judgment_aitech_q2",
      rows: 3,
      columns: 90,
      required: true,
    },
  ],
  button_label: next_text,
};

// waiting period
const rt_partner_aitech = jsPsych.randomization.randomInt(85000, 95000);
const hourglass_aitech = {
  type: jsPsychImageKeyboardResponse,
  stimulus: img_hourglass,
  stimulus_width: 240,
  stimulus_height: 180,
  maintain_aspect_ratio: false,
  render_on_canvas: false,
  prompt: "<p>John is writing now. Please wait a moment...</p>",
  choices: "NO_KEYS",
  trial_duration: function () {
    var rt_participant_aitech = jsPsych.data.get().last(1).values()[0].rt;
    if (time_left_aitech < 1) {
      var time_left_aitech = 1;
    } else {
      var time_left_aitech = rt_partner_aitech - rt_participant_aitech;
    }
    return time_left_aitech;
  },
  post_trial_gap: 3000,
};

// result summary
const summary_aitech = make_summary((topic = "ai_tech"));

// follow-up questions
const followup_inst_aitech = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus:
    "The judgment task on AI technology has been completed.<br>Before proceeding, please answer some follow-up questions on the current topic.<br><u>Note that your answers to the follow-up questions will not be shown to John.</u><br><br>" +
    '<font color="#c00000"><i>*It will proceed to the next page after 10 seconds.</i></font>',
  choices: "NO_KEYS",
  trial_duration: 10000,
};

// follow-up 1 (Moral conviction)
const mc1_aitech = {
  type: jsPsychSurveyLikert,
  preamble: '<p style="text-align:left">' + inst_mc + "</p>",
  questions: [
    {
      prompt: '<p style="text-align:left">' + items_mc[0] + "</p>",
      labels: scale_mc,
      name: "mc1_aitech",
      required: true,
    },
  ],
  randomize_question_order: false,
  button_label: next_text,
};

const mc2_aitech = {
  type: jsPsychSurveyLikert,
  preamble: '<p style="text-align:left">' + inst_mc + "</p>",
  questions: [
    {
      prompt: '<p style="text-align:left">' + items_mc[1] + "</p>",
      labels: scale_mc,
      name: "mc2_aitech",
      required: true,
    },
  ],
  randomize_question_order: false,
  button_label: next_text,
};

const timeline_mc_aitech = jsPsych.randomization.shuffle([
  mc1_aitech,
  mc2_aitech,
]);
const mc_blocks_aitech = { timeline: timeline_mc_aitech };

// follow-up 2 (Perceived moral conviction)
const pmc1_aitech = {
  type: jsPsychSurveyLikert,
  preamble: '<p style="text-align:left">' + inst_mc + "</p>",
  questions: [
    {
      prompt: '<p style="text-align:left">' + items_pmc[0] + "</p>",
      labels: scale_mc,
      name: "pmc1_aitech",
      required: true,
    },
  ],
  randomize_question_order: false,
  button_label: next_text,
};

const pmc2_aitech = {
  type: jsPsychSurveyLikert,
  preamble: '<p style="text-align:left">' + inst_mc + "</p>",
  questions: [
    {
      prompt: '<p style="text-align:left">' + items_pmc[1] + "</p>",
      labels: scale_mc,
      name: "pmc2_aitech",
      required: true,
    },
  ],
  randomize_question_order: false,
  button_label: next_text,
};

const timeline_pmc_aitech = jsPsych.randomization.shuffle([
  pmc1_aitech,
  pmc2_aitech,
]);
const pmc_blocks_aitech = { timeline: timeline_pmc_aitech };

// follow-up 3 (interest)
const interest_aitech = {
  type: jsPsychSurveyLikert,
  preamble: '<p style="text-align:left">' + inst_interest + "</p>",
  questions: [
    {
      prompt:
        '<p style="text-align:left">' +
        "How interested are you in this topic, whether you incorporate it into your daily life or not?" +
        "</p>",
      labels: scale_interest,
      name: "interest_aitech",
      required: true,
    },
  ],
  randomize_question_order: false,
  button_label: next_text,
};

// follow-up 4 (perceived similarity)
const p_similarity_aitech = {
  type: jsPsychSurveyLikert,
  preamble: '<p style="text-align:left">' + inst_p_similarity + "</p>",
  questions: [
    {
      prompt:
        '<p style="text-align:left">' +
        "To what extent do you think is John's answer similar to yours?" +
        "</p>",
      labels: scale_p_similarity,
      name: "p_similarity_aitech",
      required: true,
    },
  ],
  randomize_question_order: false,
  button_label: next_text,
};

// follow-up 5 (emotionality)
const emotionality_aitech = {
  type: jsPsychSurveyLikert,
  preamble: '<p style="text-align:left">' + inst_emotionality + "</p>",
  questions: [
    {
      prompt:
        '<p style="text-align:left">' +
        "In your opinion, how strong are John's emotions about this topic?" +
        "</p>",
      labels: scale_emotionality,
      name: "emotionality_aitech",
      required: true,
    },
  ],
  randomize_question_order: false,
  button_label: next_text,
};

// follow-up 6 (TF question)
const tf_aitech = {
  type: jsPsychSurveyLikert,
  preamble: '<p style="text-align:left">' + inst_tf + "</p>",
  questions: [
    {
      prompt:
        '<p style="text-align:left">' +
        "John is willing to incorporate AI technology into his daily life." +
        "</p>",
      labels: ["True", "False"],
      name: "tf_aitech",
      required: true,
    },
  ],
  randomize_question_order: false,
  button_label: next_text,
};

// follow-up 7 (attention checks)
const ac_aitech = {
  type: jsPsychSurveyLikert,
  preamble: '<p style="text-align:left">' + inst_ac + "</p>",
  questions: [
    {
      prompt:
        '<p style="text-align:left">' +
        "This is an attention check item. Please respond to this item by selecting 3." +
        "</p>",
      labels: scale_ac,
      name: "ac_aitech",
      required: true,
    },
  ],
  randomize_question_order: false,
  button_label: next_text,
};

const followup_aitech = [
  mc_blocks_aitech,
  pmc_blocks_aitech,
  interest_aitech,
  p_similarity_aitech,
  emotionality_aitech,
];

const timeline_followup_aitech = jsPsych.randomization.sampleWithoutReplacement(
  (array = followup_aitech),
  (sampleSize = 5)
);

timeline_followup_aitech.splice(2, 0, tf_aitech);
timeline_followup_aitech.splice(5, 0, ac_aitech);

const followup_blocks_aitech = {
  timeline: timeline_followup_aitech,
};

const followup_end_aitech = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus:
    "The follow-up questions have been completed.<br><br>" +
    '<font color="#c00000"><i>*It will proceed to the next page after 5 seconds.</i></font>',
  choices: "NO_KEYS",
  trial_duration: 5000,
};

// save as a block
const block_aitech = {
  timeline: [
    judgment_aitech,
    judgment_aitech_q1,
    judgment_aitech_q2,
    hourglass_aitech,
    summary_aitech,
    followup_inst_aitech,
    followup_blocks_aitech,
    followup_end_aitech,
  ],
};

// judgment task end
const judgment_task_end = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus:
    "The judgment task has been completed.<br><br>" +
    '<font color="#c00000"><i>*It will proceed to the next page after 5 seconds.</i></font>',
  choices: "NO_KEYS",
  trial_duration: 5000,
};

// impression
const srg_inst = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus:
    "We will ask about <b>your current impression of John</b> on the next page.<br><u>Note that your answers to the questions will not be shown to John.</u><br><br>" +
    '<font color="#c00000"><i>*It will proceed to the next page after 10 seconds.</i></font>',
  choices: "NO_KEYS",
  trial_duration: 10000,
};

const scale_srg = [
  "1<br>strongly<br>disagree",
  "2",
  "3",
  "4<br>neither agree<br>nor disagree",
  "5",
  "6",
  "7<br>strongly<br>agree",
];

const inst_srg =
  "To what extent do you agree with the following statement? Please select the number that best describes your idea.";

const items_srg = [
  "I feel we have similar thoughts and ideas on various topics.",
  "I feel we hold similar worldviews.",
  "I feel we will make the same judgment when we are in the same situation.",
  "I feel we will experience the same emotions when we see the same thing.",
  "I feel we can reach a consensus on various social issues.",
  // reverse items
  "I feel we hold completely different worldviews.",
  "I feel we cannot have a consensus on anything.",
  "I feel we hold completely different values.",
];

const names_srg = [
  "srg1",
  "srg2",
  "srg3",
  "srg4",
  "srg5",
  "srg6",
  "srg7",
  "srg8",
];

// create blocks
let order_srg = make_order(items_srg.length);
let qs_srg = {};
let srg_block = {};
let timeline_srg = [];
for (var i = 0; i < items_srg.length; i++) {
  qs_srg[i] = make_qs(
    (items = items_srg),
    (order = order_srg),
    (start = i + 1),
    (end = i + 1),
    (scale = scale_srg),
    (names = names_srg)
  );
  srg_block[i] = make_block((inst = inst_srg), (qs = qs_srg[i]));
  timeline_srg.push(srg_block[i]);
}

// srg: attention check
const srg_ac = {
  type: jsPsychSurveyLikert,
  preamble: '<p style="text-align:left">' + inst_srg + "</p>",
  questions: [
    {
      prompt:
        '<p style="text-align:left">' +
        "This is an attention check item. Please respond to this item by selecting 2." +
        "</p>",
      labels: scale_srg,
      name: "srg_ac",
      required: true,
    },
  ],
  randomize_question_order: false,
  button_label: next_text,
};

timeline_srg.splice(4, 0, srg_ac);

const srg_blocks = {
  timeline: timeline_srg,
};

// waiting period
const rt_partner = jsPsych.randomization.randomInt(55000, 65000);
const hourglass3 = {
  type: jsPsychImageKeyboardResponse,
  stimulus: img_hourglass,
  stimulus_width: 240,
  stimulus_height: 180,
  maintain_aspect_ratio: false,
  render_on_canvas: false,
  prompt: "<p>John is answering now. Please wait a moment...</p>",
  choices: "NO_KEYS",
  trial_duration: function () {
    var rtp_1 = jsPsych.data.get().last(1).values()[0].rt;
    var rtp_2 = jsPsych.data.get().last(2).values()[0].rt;
    var rtp_3 = jsPsych.data.get().last(3).values()[0].rt;
    var rtp_4 = jsPsych.data.get().last(4).values()[0].rt;
    var rtp_5 = jsPsych.data.get().last(5).values()[0].rt;
    var rtp_6 = jsPsych.data.get().last(6).values()[0].rt;
    var rtp_7 = jsPsych.data.get().last(7).values()[0].rt;
    var rtp_8 = jsPsych.data.get().last(8).values()[0].rt;
    var rtp_9 = jsPsych.data.get().last(9).values()[0].rt;
    var rt_participant =
      rtp_1 + rtp_2 + rtp_3 + rtp_4 + rtp_5 + rtp_6 + rtp_7 + rtp_8 + rtp_9;
    if (time_left < 1) {
      var time_left = 1;
    } else {
      var time_left = rt_partner - rt_participant;
    }
    return time_left;
  },
  post_trial_gap: 3000,
};

// dependent measures
const dv_inst = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus:
    'You are now proceeding to the "<b>pair task</b>."<br><b>In this task, you will talk about a political issue in the U.S. with John via online chat.</b><br><br>Before starting the task, please answer some questions.<br><u>Note that your answers to the questions will not be shown to John.</u><br><br>' +
    '<font color="#c00000"><i>*It will proceed to the next page after 20 seconds.</i></font>',
  choices: "NO_KEYS",
  trial_duration: 20000,
};

const scale_dv = [
  "1<br>strongly<br>disagree",
  "2",
  "3",
  "4<br>neither agree<br>nor disagree",
  "5",
  "6",
  "7<br>strongly<br>agree",
];

const inst_dv =
  "To what extent do you agree with the following statement? Please select the number that best describes your idea.";

const items_dv = [
  "I expect we will have similar opinions on the topic we will discuss.",
  "I think I can change John's opinion through conversation if we have different views on the topic we will discuss.",
  "If I can participate in the task with another person other than John, I would prefer to do so.",
  "If I can switch to another conversation task unrelated to politics with John, I would prefer to do so.",
  "Political or not, I do NOT want to talk with John.",
];

const names_dv = [
  "e_similarity",
  "e_malleability",
  "avoidance_ps",
  "avoidance_t",
  "avoidance_pg",
];

// create blocks (one item per page)
let order_dv = make_order(items_dv.length);

let qs_dv = {};
let dv_block = {};
let timeline_dv = [];
for (var i = 0; i < items_dv.length; i++) {
  qs_dv[i] = make_qs(
    (items = items_dv),
    (order = order_dv),
    (start = i + 1),
    (end = i + 1),
    (scale = scale_dv),
    (names = names_dv)
  );
  dv_block[i] = make_block((inst = inst_dv), (qs = qs_dv[i]));
  timeline_dv.push(dv_block[i]);
}

const dv_blocks = {
  timeline: timeline_dv,
};

// end
const complete = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus:
    'We appreciate your cooperation.<br>It concludes the experimental program.<br><br>You are now redirected to the survey webpage.<br>You will be asked to enter the "password" to confirm you have completed the experiment.<br><br>The password is <b>' +
    password +
    "</b>. Please copy and save it before proceeding.<br><br>" +
    '<font color="#c00000"><i>*It will proceed to the next page after 20 seconds.</i></font>',
  choices: "NO_KEYS",
  trial_duration: 20000,
};

// exit full-screen mode
const exit_fs = {
  type: jsPsychFullscreen,
  fullscreen_mode: false,
  delay_after: 0,
};

// timeline (counterbalance)
const define_timeline = function () {
  if (topic_1 == "insect_food") {
    new_timeline = {
      timeline: [
        preload,
        intro,
        age,
        sex,
        race,
        ideology_blocks,
        pairing_start,
        hourglass,
        nickname_self,
        nickname_info,
        judgment_inst,
        block_ifood,
        block_aitech,
        judgment_task_end,
        srg_inst,
        srg_blocks,
        hourglass3,
        dv_inst,
        dv_blocks,
        complete,
        exit_fs,
      ],
    };
  }
  if (topic_1 == "ai_tech") {
    new_timeline = {
      timeline: [
        preload,
        intro,
        age,
        sex,
        race,
        ideology_blocks,
        pairing_start,
        hourglass,
        nickname_self,
        nickname_info,
        judgment_inst,
        block_aitech,
        block_ifood,
        judgment_task_end,
        srg_inst,
        srg_blocks,
        hourglass3,
        dv_inst,
        dv_blocks,
        complete,
        exit_fs,
      ],
    };
  }
  return new_timeline;
};

const questionnaire = define_timeline();
