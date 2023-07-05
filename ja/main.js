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
const next_text = "次のページへ";

// image
const img_hourglass =
  "https://kai21rilh.github.io/experiment_mc05/ja/img/hourglass_animated.gif";

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
    "<p>サーバーへの接続が完了しました。実験を開始します。<br><br>下のボタンを押して、先に進んでください。</p>",
  button_label: next_text,
};

// demographics
const age = {
  type: jsPsychSurveyText,
  preamble: "最初に、あなた自身のことについて伺います。",
  questions: [
    {
      prompt: "あなたの年齢について回答してください。",
      placeholder: "半角数字のみ（例．40）",
      name: "age",
      columns: 30,
      required: true,
    },
  ],
  button_label: next_text,
};

const sex = {
  type: jsPsychSurveyLikert,
  preamble: "最初に、あなた自身のことについて伺います。",
  questions: [
    {
      prompt: "あなたの性別について回答してください。",
      labels: ["男性", "女性", "その他"],
      name: "sex",
      required: true,
    },
  ],
  scale_width: 600,
  randomize_question_order: false,
  button_label: next_text,
};

// ideology
const scale_ideology = [
  "1<br>かなり<br>リベラル",
  "2<br><br>リベラル",
  "3<br>やや<br>リベラル",
  "4<br><br>中立",
  "5<br>やや<br>保守的",
  "6<br><br>保守的",
  "7<br>かなり<br>保守的",
];

const inst_ideology =
  "社会的・経済的・政治的な問題に関する考え方の違いについて、「保守的－リベラル」と区分されることがあります。以下の質問を読んで、あなた自身の立場に最も近い数字を選んでください。";

const items_ideology = [
  // social
  "<b><u>環境や人権などの社会的なことがらについて</u></b><br>「保守的」を、伝統的な価値を重視し急激な変革よりも安定を望む立場、「リベラル」を、現状維持よりも改革を重視し弱者の地位向上を志向する立場と定義するなら、あなたはどちらかというと、社会的に保守的ですか？リベラルですか？",
  // economic
  "<b><u>経済的なことがらについて</u></b><br>「保守的」を、競争原理に基づく自由な経済活動を望む立場、「リベラル」を、政府の規制等に基づく平等な富の分配を望む立場と定義するなら、あなたはどちらかというと、経済的に保守的ですか？リベラルですか？",
  // political
  "<b><u>政治的な志向について</u></b><br>「保守的」を、社会の制度を作ったり政治力を用いたりする目的が、安定した社会を築くためだと考える立場、「リベラル」を、それらが社会の改革のためにあると考える立場と定義するなら、あなたはどちらかというと、政治的に保守的ですか？リベラルですか？",
];

const names_ideology = ["socioid", "econoid", "politid"];

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
    "これから、他の参加者とペアを組んでいただきます。<br>パートナーとなる参加者の割り当ては、ランダムにおこなわれます。<br><br>準備ができたら、下のボタンを押して、先に進んでください。<br><br>" +
    '<font color="#c00000">※現在の参加状況によっては、ペアがうまく組まれない場合があります。<br>申し訳ありませんが、あらかじめご承知おきください。</font>',
  choices: ["パートナーを探す"],
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
    '<p>現在、パートナーとなる参加者の方を探しています。しばらくお待ちください・・・</p><p style="color:#c00000">※もし、30秒以内に画面が進まない場合は、申し訳ありませんが、後ほど改めてご参加ください。</p>',
  choices: "NO_KEYS",
  trial_duration: wp,
  post_trial_gap: 5000,
};

// nickname setting
const nickname_self = {
  type: jsPsychSurveyLikert,
  preamble:
    'お待たせしました。無事にペアリングが完了しました。<br><br>事前にお伝えした通り、この研究ではペアで課題に取り組んでいただきます。<br>そのために、まず、お互いのニックネームを決定します。<br>以下から、<b>あなたが本研究で使用するニックネーム</b>を選択してください。<br><br><font color="#c00000">※重複を避けるため、お二人には異なる選択肢を提示しています。</font>',
  questions: [
    {
      prompt: "どのニックネームを使用しますか？",
      labels: ["佐藤", "鈴木", "高橋", "田中"],
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
      var chosen_nn = "佐藤";
    } else if (resp == 1) {
      var chosen_nn = "鈴木";
    } else if (resp == 2) {
      var chosen_nn = "高橋";
    } else if (resp == 3) {
      var chosen_nn = "田中";
    }
    return (
      "ありがとうございました。<br>あなたの名前は<b>「" +
      chosen_nn +
      '」さん</b>、パートナーの名前は<b>「山口」さん</b>です。<br>実験中はこの名前を使用するので、忘れないようにしてください。<br><br><font color="#c00000">※10秒後に、次の画面へ自動的に移動します。</font>'
    );
  },
  choices: "NO_KEYS",
  trial_duration: 10000,
};

// judgment task
// preambles, sentences, and scale
const inst_q1 =
  "以下の文を読んで、あなたの考えにもっとも近い数字を選んで回答してください。";

const inst_q2 = "以下の指示をよく読んで、ページ下部の空欄に記入してください。";

const ifood_sentence =
  "あなたは、もし昆虫食が近所のスーパーで手に入るようになったら、日常食として購入したいと思いますか？";

const aitech_sentence =
  "あなたは、AI技術を自身の日常生活のさまざまな場面で積極的に取り入れていきたいと思いますか？";

const scale_q1_ifood = [
  "1<br>まったく<br>購入したくない",
  "2<br><br>購入したくない",
  "3<br>あまり<br>購入したくない",
  "4<br>やや<br>購入したい",
  "5<br><br>購入したい",
  "6<br>非常に<br>購入したい",
];

const scale_q1_aitech = [
  "1<br>まったく<br>取り入れたくない",
  "2<br><br>取り入れたくない",
  "3<br>あまり<br>取り入れたくない",
  "4<br>やや<br>取り入れたい",
  "5<br><br>取り入れたい",
  "6<br>非常に<br>取り入れたい",
];

const labels_q1_ifood = [
  "まったく購入したくない",
  "購入したくない",
  "あまり購入したくない",
  "やや購入したい",
  "購入したい",
  "非常に購入したい",
];

const labels_q1_aitech = [
  "まったく取り入れたくない",
  "取り入れたくない",
  "あまり取り入れたくない",
  "やや取り入れたい",
  "取り入れたい",
  "非常に取り入れたい",
];

// topic
const ifood_self =
  '<p style="text-align:left"><b>あなたの回答：</b><br><u>Q1. 昆虫食を日常食として購入したい？：</u>';

const aitech_self =
  '<p style="text-align:left"><b>あなたの回答：</b><br><u>Q1. AI技術を取り入れたい？：</u>';

// condition
const positive_nonmoral_ifood =
  "<u>Q1. 昆虫食を日常食として購入したい？：</u><br>6（非常に購入したい）<br><u>Q2. 昆虫食についてどう思う？：</u><br>以前に昆虫食を実際に体験したことがあり、味がとても美味しかったので、もし日常的に食べられるなら、ぜひそうしたいと思います。";

const positive_moral_ifood =
  "<u>Q1. 昆虫食を日常食として購入したい？：</u><br>6（非常に購入したい）<br><u>Q2. 昆虫食についてどう思う？：</u><br>やがて来る食糧難の未来において、昆虫食は人々の義務となるでしょうから、今から積極的に取り入れていくべきだと思います。";

const negative_nonmoral_ifood =
  "<u>Q1. 昆虫食を日常食として購入したい？：</u><br>1（まったく購入したくない）<br><u>Q2. 昆虫食についてどう思う？：</u><br>以前に昆虫食を実際に体験したことがありますが、味がまったく好みではなかったので、機会があっても、もう食べたいとは思いません。";

const negative_moral_ifood =
  "<u>Q1. 昆虫食を日常食として購入したい？：</u><br>1（まったく購入したくない）<br><u>Q2. 昆虫食についてどう思う？：</u><br>他に食べられるものが色々あるのに、よりによって「虫」を食べるなんて、爬虫類ではないのですから、人間として間違っていると思います。";

const positive_nonmoral_aitech =
  "<u>Q1. AI技術を取り入れたい？：</u><br>6（非常に取り入れたい）<br><u>Q2. AI技術についてどう思う？：</u><br>AI技術は色々な仕事にかかる時間を短縮してくれて、効率化が図れるので、ぜひ自分の生活に積極的に取り入れていきたいと思います。";

const positive_moral_aitech =
  "<u>Q1. AI技術を取り入れたい？：</u><br>6（非常に取り入れたい）<br><u>Q2. AI技術についてどう思う？：</u><br>AI技術に適応できない人々は、やがて社会から淘汰されていくでしょう。今からこうした技術に慣れておくのは、私たちの責務だと思います。";

const negative_nonmoral_aitech =
  "<u>Q1. AI技術を取り入れたい？：</u><br>1（まったく取り入れたくない）<br><u>Q2. AI技術についてどう思う？：</u><br>AI技術は確かに便利なのかもしれませんが、私としては、自分で考えて手を動かす時間をとることが好きなので、特に魅力を感じません。";

const negative_moral_aitech =
  "<u>Q1. AI技術を取り入れたい？：</u><br>1（まったく取り入れたくない）<br><u>Q2. AI技術についてどう思う？：</u><br>AI技術は、私たちを依存させる麻薬のようなものです。決して頼ってはいけません。でないと、やがて自分で考える力が奪われてしまいます。";

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
          '<p style="text-align:left">以下に、あなたと山口さんの回答を表示します。</p><br>' +
          ifood_self +
          "<br>" +
          response_q1 +
          "（" +
          labels_q1_ifood[response_q1 - 1] +
          "）<br>" +
          "<u>Q2. 昆虫食についてどう思う？：</u><br>" +
          response_q2 +
          "</p><br>" +
          '<p style="text-align:left"><b>山口さんの回答：</b><br>';
        var stim_b =
          "</p>" +
          '<font color="#c00000"><br><br>※30秒後に、次の画面へ自動的に移動します。</font>';
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
          '<p style="text-align:left">以下に、あなたと山口さんの回答を表示します。</p><br>' +
          aitech_self +
          "<br>" +
          response_q1 +
          "（" +
          labels_q1_aitech[response_q1 - 1] +
          "）<br>" +
          "<u>Q2. AI技術についてどう思う？：</u><br>" +
          response_q2 +
          "</p><br>" +
          '<p style="text-align:left"><b>山口さんの回答：</b><br>';
        var stim_b =
          "</p>" +
          '<font color="#c00000"><br><br>※30秒後に、次の画面へ自動的に移動します。</font>';
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
    "さて、ペア課題を始める前に、お二人には<b>「判断課題」</b>に参加していただきます。<br><br>" +
    "この課題では、2つの題材について、各自が同じ質問に回答し、互いの回答を閲覧することができます。<br><u>これは、ペア課題に向けて、相手の物事への考え方について知っていただくために行われます</u>。<br><br>" +
    '<font color="#c00000">※20秒後に、自動的に課題がスタートします。少々お待ちください。</font>',
  choices: "NO_KEYS",
  trial_duration: 20000,
};

// topic: insect_food
const judgment_ifood = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<p style="font-size:16pt"><b>題材：昆虫食について</b></p>',
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
        "昆虫食についてのあなたの考えを、山口さんに短い文章で自由に伝えてください。<br>（例．あなたが昆虫食に肯定的あるいは否定的な理由）",
      placeholder: "この枠内に1行～1行半程度で記述してください",
      name: "judgment_ifood_q2",
      rows: 3,
      columns: 90,
      required: true,
    },
  ],
  button_label: next_text,
};

// waiting period
const rt_partner_ifood = jsPsych.randomization.randomInt(55000, 65000);
const hourglass_ifood = {
  type: jsPsychImageKeyboardResponse,
  stimulus: img_hourglass,
  stimulus_width: 240,
  stimulus_height: 180,
  maintain_aspect_ratio: false,
  render_on_canvas: false,
  prompt: "<p>現在、山口さんが回答中です。しばらくお待ちください・・・</p>",
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
    "昆虫食についての判断課題は以上で終了です。<br>先に進む前に、今の題材について、いくつか追加の質問に回答してください。<br><u>なお、追加の質問への回答は、山口さんには表示されません。</u><br><br>" +
    '<font color="#c00000">※10秒後に、自動的に次のページに移動します。</font>',
  choices: "NO_KEYS",
  trial_duration: 10000,
};

// follow-up 1 (Moral conviction)
const scale_mc1 = [
  "1<br>まったく<br>反映していない",
  "2<br>少し<br>反映している",
  "3<br>ある程度<br>反映している",
  "4<br>強く<br>反映している",
  "5<br>非常に強く<br>反映している",
];

const scale_mc2 = [
  "1<br>まったく<br>関係していない",
  "2<br>少し<br>関係している",
  "3<br>ある程度<br>関係している",
  "4<br>強く<br>関係している",
  "5<br>非常に強く<br>関係している",
];

const inst_mc =
  "以下の質問を読み、あなたの考えに最もよく当てはまる選択肢を選んでください。";

const items_mc = [
  "この話題についての<b>あなたの</b>立場は、あなたが根底に持っている道徳的な信念や信条を、どのくらい反映していますか？",
  "この話題についての<b>あなたの</b>立場は、基本的な善悪についての、あなたの考え方と、どのくらい関係していますか？",
];

const mc1_ifood = {
  type: jsPsychSurveyLikert,
  preamble: '<p style="text-align:left">' + inst_mc + "</p>",
  questions: [
    {
      prompt: '<p style="text-align:left">' + items_mc[0] + "</p>",
      labels: scale_mc1,
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
      labels: scale_mc2,
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
  "この話題についての<b>山口さんの</b>立場は、山口さんが根底に持っている道徳的な信念や信条を、どのくらい反映していると思いますか？",
  "この話題についての<b>山口さんの</b>立場は、基本的な善悪についての、山口さんの考え方と、どのくらい関係していると思いますか？",
];

const pmc1_ifood = {
  type: jsPsychSurveyLikert,
  preamble: '<p style="text-align:left">' + inst_mc + "</p>",
  questions: [
    {
      prompt: '<p style="text-align:left">' + items_pmc[0] + "</p>",
      labels: scale_mc1,
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
      labels: scale_mc2,
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
  "以下の文について、あなたに当てはまる選択肢を選んで回答してください。";

const scale_interest = [
  "1<br>まったく<br>関心が無い",
  "2",
  "3",
  "4<br>ある程度<br>関心がある",
  "5",
  "6",
  "7<br>非常に<br>関心がある",
];

const interest_ifood = {
  type: jsPsychSurveyLikert,
  preamble: '<p style="text-align:left">' + inst_interest + "</p>",
  questions: [
    {
      prompt:
        '<p style="text-align:left">' +
        "あなたは、昆虫食というトピックについて、日常食として取り入れるかどうかは別として、どのくらい関心がありますか？" +
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
  "以下の質問について、あなたの考えにもっとも近い数字を選んで回答してください。";

const scale_p_similarity = [
  "1<br>まったく<br>似ていない",
  "2<br>少し<br>似ている",
  "3<br>ある程度<br>似ている",
  "4<br>よく<br>似ている",
  "5<br>非常によく<br>似ている",
];

const p_similarity_ifood = {
  type: jsPsychSurveyLikert,
  preamble: '<p style="text-align:left">' + inst_p_similarity + "</p>",
  questions: [
    {
      prompt:
        '<p style="text-align:left">' +
        "あなたは、自分と山口さんの意見はどれくらい似ていたと思いますか？" +
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
  "以下の質問について、あなたの考えにもっとも近い数字を選んで回答してください。";

const scale_emotionality = [
  "1<br>非常に<br>弱い",
  "2",
  "3",
  "4<br>ある程度<br>強い",
  "5",
  "6",
  "7<br>非常に<br>強い",
];

const emotionality_ifood = {
  type: jsPsychSurveyLikert,
  preamble: '<p style="text-align:left">' + inst_emotionality + "</p>",
  questions: [
    {
      prompt:
        '<p style="text-align:left">' +
        "このトピックについて、<b>山口さんが抱いている感情</b>は、どのくらい強いものだと思いますか？" +
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
const inst_tf = "以下の文を読み、正しい答えを選択してください。";

const tf_ifood = {
  type: jsPsychSurveyLikert,
  preamble: '<p style="text-align:left">' + inst_tf + "</p>",
  questions: [
    {
      prompt:
        '<p style="text-align:left">' +
        "昆虫食を日常食とすることに対して、山口さんは積極的である。" +
        "</p>",
      labels: ["誤り", "正しい"],
      name: "tf_ifood",
      required: true,
    },
  ],
  randomize_question_order: false,
  button_label: next_text,
};

// follow-up 7 (attention checks)
const scale_ac = [
  "1<br>全く<br>当てはまらない",
  "2",
  "3",
  "4<br>どちらとも<br>言えない",
  "5",
  "6",
  "7<br>非常によく<br>当てはまる",
];

const inst_ac =
  "以下の質問について、あなたの考えにもっとも近い数字を選んで回答してください。";

const ac_ifood = {
  type: jsPsychSurveyLikert,
  preamble: '<p style="text-align:left">' + inst_ac + "</p>",
  questions: [
    {
      prompt:
        '<p style="text-align:left">' +
        "注意確認項目です。この設問には「6」と回答してください。" +
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
    "追加の質問は以上です。<br><br>" +
    '<font color="#c00000">※5秒後に、自動的に次のページに移動します。</font>',
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
  stimulus: '<p style="font-size:16pt"><b>題材：AI技術について</b></p>',
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
        "AI技術についてのあなたの考えを、山口さんに短い文章で自由に伝えてください。<br>（例．あなたがAI技術に肯定的あるいは否定的な理由）",
      placeholder: "この枠内に1行～1行半程度で記述してください",
      name: "judgment_aitech_q2",
      rows: 3,
      columns: 90,
      required: true,
    },
  ],
  button_label: next_text,
};

// waiting period
const rt_partner_aitech = jsPsych.randomization.randomInt(55000, 65000);
const hourglass_aitech = {
  type: jsPsychImageKeyboardResponse,
  stimulus: img_hourglass,
  stimulus_width: 240,
  stimulus_height: 180,
  maintain_aspect_ratio: false,
  render_on_canvas: false,
  prompt: "<p>現在、山口さんが回答中です。しばらくお待ちください・・・</p>",
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
    "AI技術についての判断課題は以上で終了です。<br>先に進む前に、今の題材について、いくつか追加の質問に回答してください。<br><u>なお、追加の質問への回答は、山口さんには表示されません。</u><br><br>" +
    '<font color="#c00000">※10秒後に、自動的に次のページに移動します。</font>',
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
      labels: scale_mc1,
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
      labels: scale_mc2,
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
      labels: scale_mc1,
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
      labels: scale_mc2,
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
        "あなたは、AI技術というトピックについて、自身の生活に取り入れるかどうかは別として、どのくらい関心がありますか？" +
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
        "あなたは、自分と山口さんの意見はどれくらい似ていたと思いますか？" +
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
        "このトピックについて、<b>山口さんが抱いている感情</b>は、どのくらい強いものだと思いますか？" +
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
        "AI技術を日常生活に取り入れることに対して、山口さんは積極的である。" +
        "</p>",
      labels: ["誤り", "正しい"],
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
        "注意確認項目です。この設問には「3」と回答してください。" +
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
    "追加の質問は以上です。<br><br>" +
    '<font color="#c00000">※5秒後に、自動的に次のページに移動します。</font>',
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
    "以上で「判断課題」は終了です。<br><br>" +
    '<font color="#c00000">※5秒後に、自動的に次のページに移動します。</font>',
  choices: "NO_KEYS",
  trial_duration: 5000,
};

// impression
const srg_inst = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus:
    "次のページから、<b>現時点での山口さんの印象</b>について回答していただきます。<br><u>なお、質問への回答は、山口さんには表示されません。</u><br><br>" +
    '<font color="#c00000">※10秒後に、自動的に次のページに移動します。</font>',
  choices: "NO_KEYS",
  trial_duration: 10000,
};

const scale_srg = [
  "1<br>全く<br>そう思わない",
  "2",
  "3",
  "4<br>どちらとも<br>言えない",
  "5",
  "6",
  "7<br>非常に強く<br>そう思う",
];

const inst_srg =
  "以下の文は、あなたの考えにどの程度あてはまりますか。あなたの考えにもっとも近い数字を選んで回答してください。";

const items_srg = [
  "私たちは、世の中のさまざまな事柄について似た考えを持っていると思う。",
  "私たちは、互いによく似た世界観の中で生きていると思う。",
  "私たちは、同じ状況に置かれれば、同じ判断を下すと思う。",
  "私たちは、同じものを見れば、同じ感情を抱くと思う。",
  "私たちは、さまざまな社会問題への意見について、概ね互いに同意できると思う。",
  // reverse items
  "私たちは、互いにまったくの別世界で生きていると思う。",
  "私たちは、何事についても、互いに分かり合えることはないと思う。",
  "私たちは、互いにまったく異なる価値観を持っていると思う。",
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
        "注意確認項目です。この設問には「2」と回答してください。" +
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
const rt_partner = jsPsych.randomization.randomInt(40000, 50000);
const hourglass3 = {
  type: jsPsychImageKeyboardResponse,
  stimulus: img_hourglass,
  stimulus_width: 240,
  stimulus_height: 180,
  maintain_aspect_ratio: false,
  render_on_canvas: false,
  prompt: "<p>現在、山口さんが回答中です。しばらくお待ちください・・・</p>",
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
    "それでは、これから<b>「ペア課題」</b>を開始します。<br><b>ペア課題では、日本のとある政治的トピックについて、チャット形式で会話をしていただきます。</b><br><br>課題を開始する前に、いくつかの質問に回答してください。<br><u>なお、あなたの回答は、山口さんには表示されません。</u><br><br>" +
    '<font color="#c00000">※20秒後に、自動的に次のページに移動します。</font>',
  choices: "NO_KEYS",
  trial_duration: 20000,
};

const scale_dv = [
  "1<br>全く<br>そう思わない",
  "2",
  "3",
  "4<br>どちらとも<br>言えない",
  "5",
  "6",
  "7<br>非常に強く<br>そう思う",
];

const inst_dv =
  "以下の文は、あなたの考えにどの程度あてはまりますか。あなたの考えにもっとも近い数字を選んで回答してください。";

const items_dv = [
  "私たちは、これから会話するトピックについて、似た意見を持っている気がする。",
  "これから会話するトピックについて、仮に意見が違っても、私は山口さんの意見を変えられると思う。",
  "もし、この課題に山口さん以外の人物と参加できるなら、そうしたい。",
  "もし、山口さんと一緒に、政治とは無関係な別の会話課題に移れるなら、そうしたい。",
  "政治的であろうとなかろうと、山口さんとは話したくない。",
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
    "ご協力いただき、ありがとうございました。以上で実験プログラムは終了です。<br><br>これから、冒頭の調査用ページに戻ります。<br>後ほど、実験プログラムを完了したことを確認するため、「パスワード」が尋ねられます。<br><br>あなたに入力していただくパスワードは <b>" +
    password +
    "</b> です。<br>忘れずにメモ帳などに保存してください。<br><br>" +
    '<font color="#c00000">※20秒後に、自動的に画面が遷移します。しばらくお待ちください。</font>',
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
