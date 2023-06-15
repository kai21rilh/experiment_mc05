// initializing
const jsPsych = initJsPsych({
  display_element: "display_stage",
  experiment_width: 1100,
  default_iti: 250,
  on_finish: function () {
    var datajs = jsPsych.data.get().json();
    Qualtrics.SurveyEngine.setEmbeddedData("ids", idnum);
    Qualtrics.SurveyEngine.setEmbeddedData("c1", assignment_c1);
    Qualtrics.SurveyEngine.setEmbeddedData("c2", assignment_c2);
    Qualtrics.SurveyEngine.setEmbeddedData("datajs", datajs);
    jQuery("#display_stage").remove();
    jQuery("#display_stage_background").remove();
  },
});

// general variables
const next_text = "次のページへ";
const inst_general =
  "以下の文は、あなたの考えにどの程度あてはまりますか。あなたの考えにもっとも近い数字を選んで回答してください。";
const scale_general = [
  "1<br>全く<br>そう思わない",
  "2",
  "3",
  "4<br>どちらとも<br>言えない",
  "5",
  "6",
  "7<br>非常に強く<br>そう思う",
];

// image
const img_hourglass =
  "https://kai21rilh.github.io/experiment_mc05/jp/img/hourglass_animated.gif";

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

// ID number
const idnum = jsPsych.randomization.randomInt(10000000, 99999999);

// introduction
const intro = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: "サーバーへの接続が完了しました。実験を開始します。",
  choices: "NO_KEYS",
  trial_duration: 3000,
};

// demographics
const age = {
  type: jsPsychSurveyText,
  preamble: "最初に、あなた自身のことについて伺います。",
  questions: [
    {
      prompt: "あなたの年齢について回答してください。",
      placeholder: "半角数字のみ（例．34）",
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
    "<p>これから、他の参加者とペアを組んでいただきます。<br>パートナーとなる参加者の割り当ては、ランダムにおこなわれます。</p>" +
    "<p>準備ができたら、下のボタンを押して、先に進んでください。</p>" +
    '<p style="color:red">※現在の参加状況によっては、ペアがうまく組まれない場合があります。<br>申し訳ありませんが、あらかじめご承知おきください。</p>',
  choices: ["パートナーを探す"],
  post_trial_gap: 1000,
};

// waiting period
var wp = jsPsych.randomization.randomInt(15000, 20000);
const hourglass = {
  type: jsPsychImageKeyboardResponse,
  stimulus: img_hourglass,
  stimulus_width: 280,
  stimulus_height: 210,
  maintain_aspect_ratio: false,
  render_on_canvas: false,
  prompt:
    '<p>現在、パートナーとなる参加者の方を探しています。しばらくお待ちください・・・</p><p style="color:red">※もし、30秒以内に画面が進まない場合は、申し訳ありませんが、後ほど改めてご参加ください。</p>',
  choices: "NO_KEYS",
  trial_duration: wp,
  post_trial_gap: 5000,
};

// nickname setting
const nickname_self = {
  type: jsPsychSurveyLikert,
  preamble:
    '<p">お待たせしました。無事にペアリングが完了しました。</p><p>事前にお伝えした通り、この研究ではペアで課題に取り組んでいただきます。<br>そのために、まず、お互いのニックネームを決定します。<br>以下から、<b>あなたが本研究で使用するニックネーム</b>を選択してください。</p><p style="color:red">※重複を避けるため、お二人には異なる選択肢を提示しています。</p>',
  questions: [
    {
      prompt: "どのニックネームを使用しますか？",
      labels: ["佐藤", "鈴木", "高橋", "田中"],
      name: "nickname_self",
      required: true,
    },
  ],
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
      "<p>ありがとうございました。</p>" +
      "<p>あなたの名前は<b>「" +
      chosen_nn +
      "」さん</b>、パートナーの名前は<b>「山口」さん</b>です。<br>" +
      "実験中はこの名前を使用するので、忘れないようにしてください。</p>" +
      '<p style="color:red">※10秒後に、次の画面へ自動的に移動します。</p>'
    );
  },
  choices: "NO_KEYS",
  trial_duration: 10000,
};

// judgment task
// instructions, items, and scales
const inst_q1 =
  "以下の文は、あなたの考えにどの程度あてはまりますか。あなたの考えにもっとも近い数字を選んで回答してください。";

const inst_q2 = "以下の指示をよく読んで、ページ下部の空欄に記入してください。";

const t1_sentence =
  "私は、もし昆虫食が近所のスーパーで手に入るようになったら、日常食として購入するだろう。";

const t2_sentence =
  "私は、AI技術を自身の日常生活のさまざまな場面で積極的に取り入れていきたいと思っている。";

const scale_q1 = [
  "1<br>全く<br>当てはまらない",
  "2<br><br>当てはまらない",
  "3<br>あまり<br>当てはまらない",
  "4<br>やや<br>当てはまる",
  "5<br><br>当てはまる",
  "6<br>非常によく<br>当てはまる",
];

const labels_q1 = [
  "全く当てはまらない",
  "当てはまらない",
  "あまり当てはまらない",
  "やや当てはまる",
  "当てはまる",
  "非常によく当てはまる",
];

// topic
const insect_food =
  '<p style="text-align:left"><b>あなたの回答：</b><br><u>Q1. 昆虫食を日常食に？：</u>';

const ai_tech =
  '<p style="text-align:left"><b>あなたの回答：</b><br><u>Q1. AI技術の取り入れ？：</u>';

// condition
const positive_nonmoral_t1 =
  "<u>Q1. 昆虫食を日常食に？：</u><br>6（非常によく当てはまる）<br><u>Q2. 自由記述：</u><br>以前に昆虫食を実際に体験したことがあり、味がとても美味しかったので、もし日常的に食べられるなら、ぜひそうしたいと思います。";

const positive_moral_t1 =
  "<u>Q1. 昆虫食を日常食に？：</u><br>6（非常によく当てはまる）<br><u>Q2. 自由記述：</u><br>やがて来る食糧難の未来において、昆虫食は人々の義務となるでしょうから、今から積極的に取り入れていくべきだと思います。";

const negative_nonmoral_t1 =
  "<u>Q1. 昆虫食を日常食に？：</u><br>1（全く当てはまらない）<br><u>Q2. 自由記述：</u><br>以前に昆虫食を実際に体験したことがありますが、味がまったく好みではなかったので、機会があっても、もう食べたいとは思いません。";

const negative_moral_t1 =
  "<u>Q1. 昆虫食を日常食に？：</u><br>1（全く当てはまらない）<br><u>Q2. 自由記述：</u><br>他に食べられるものが色々あるのに、よりによって「虫」を食べるなんて、爬虫類ではないのですから、人間として間違っていると思います。";

const positive_nonmoral_t2 =
  "<u>Q1. AI技術の取り入れ？：</u><br>6（非常によく当てはまる）<br><u>Q2. 自由記述：</u><br>AI技術は色々な仕事にかかる時間を短縮してくれて、効率化が図れるので、ぜひ自分の生活に積極的に取り入れていきたいと思います。";

const positive_moral_t2 =
  "<u>Q1. AI技術の取り入れ？：</u><br>6（非常によく当てはまる）<br><u>Q2. 自由記述：</u><br>AI技術に適応できない人々は、やがて社会から淘汰されていくでしょう。今からこうした技術に慣れておくのは、私たちの責務だと思います。";

const negative_nonmoral_t2 =
  "<u>Q1. AI技術の取り入れ？：</u><br>1（全く当てはまらない）<br><u>Q2. 自由記述：</u><br>AI技術は確かに便利なのかもしれませんが、私としては、自分で考えて手を動かす時間をとることが好きなので、特に魅力を感じません。";

const negative_moral_t2 =
  "<u>Q1. AI技術の取り入れ？：</u><br>1（全く当てはまらない）<br><u>Q2. 自由記述：</u><br>AI技術は、私たちを依存させる麻薬のようなものです。決して頼ってはいけません。でないと、やがて自分で考える力が奪われてしまいます。";

// manipulation
const levels_c1 = ["match", "mismatch"];
const levels_c2 = ["moral", "nonmoral"];

const result_c1 = jsPsych.randomization.sampleWithoutReplacement(
  (array = levels_c1),
  (sampleSize = 1)
);
const result_c2 = jsPsych.randomization.sampleWithoutReplacement(
  (array = levels_c2),
  (sampleSize = 1)
);

const assignment_c1 = result_c1.toString();
const assignment_c2 = result_c2.toString();

// function
const make_summary = function (topic) {
  let new_summary = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function () {
      if (topic == insect_food) {
        // define responses
        var response_q1 =
          jsPsych.data.get().last(3).values()[0].response.judgment_t1_q1 + 1;
        var response_q2 = jsPsych.data.get().last(2).values()[0]
          .response.judgment_t1_q2;
        // stimulus (common parts)
        var stim_a =
          '<p style="text-align:left">以下に、あなたと山口さんの回答を表示します。</p>' +
          '<p style="text-align:left">' +
          t1_sentence +
          "</p>" +
          topic +
          "<br>" +
          response_q1 +
          "（" +
          labels_q1[response_q1 - 1] +
          "）<br>" +
          "<u>Q2. 自由記述：</u><br>" +
          response_q2 +
          "</p>" +
          '<p style="text-align:left"><b>山口さんの回答：</b><br>';
        var stim_b =
          "</p>" +
          '<p style="color:red"><br><br>※30秒後に、次の画面へ自動的に移動します。</p>';
        // branch
        if (assignment_c1 == "match" && assignment_c2 == "nonmoral") {
          if (response_q1 <= 3) {
            var stim = stim_a + negative_nonmoral_t1 + stim_b;
          }
          if (response_q1 >= 4) {
            var stim = stim_a + positive_nonmoral_t1 + stim_b;
          }
        }
        if (assignment_c1 == "match" && assignment_c2 == "moral") {
          if (response_q1 <= 3) {
            var stim = stim_a + negative_moral_t1 + stim_b;
          }
          if (response_q1 >= 4) {
            var stim = stim_a + positive_moral_t1 + stim_b;
          }
        }
        if (assignment_c1 == "mismatch" && assignment_c2 == "nonmoral") {
          if (response_q1 <= 3) {
            var stim = stim_a + positive_nonmoral_t1 + stim_b;
          }
          if (response_q1 >= 4) {
            var stim = stim_a + negative_nonmoral_t1 + stim_b;
          }
        }
        if (assignment_c1 == "mismatch" && assignment_c2 == "moral") {
          if (response_q1 <= 3) {
            var stim = stim_a + positive_moral_t1 + stim_b;
          }
          if (response_q1 >= 4) {
            var stim = stim_a + negative_moral_t1 + stim_b;
          }
        }
      }
      if (topic == ai_tech) {
        // define responses
        var response_q1 =
          jsPsych.data.get().last(3).values()[0].response.judgment_t2_q1 + 1;
        var response_q2 = jsPsych.data.get().last(2).values()[0]
          .response.judgment_t2_q2;
        // stimulus (common parts)
        var stim_a =
          '<p style="text-align:left">以下に、あなたと山口さんの回答を表示します。</p>' +
          '<p style="text-align:left">' +
          t2_sentence +
          "</p>" +
          topic +
          "<br>" +
          response_q1 +
          "（" +
          labels_q1[response_q1 - 1] +
          "）<br>" +
          "<u>Q2. 自由記述：</u><br>" +
          response_q2 +
          "</p>" +
          '<p style="text-align:left"><b>山口さんの回答：</b><br>';
        var stim_b =
          "</p>" +
          '<p style="color:red"><br><br>※30秒後に、次の画面へ自動的に移動します。</p>';
        // branch
        if (assignment_c1 == "match" && assignment_c2 == "nonmoral") {
          if (response_q1 <= 3) {
            var stim = stim_a + negative_nonmoral_t2 + stim_b;
          }
          if (response_q1 >= 4) {
            var stim = stim_a + positive_nonmoral_t2 + stim_b;
          }
        }
        if (assignment_c1 == "match" && assignment_c2 == "moral") {
          if (response_q1 <= 3) {
            var stim = stim_a + negative_moral_t2 + stim_b;
          }
          if (response_q1 >= 4) {
            var stim = stim_a + positive_moral_t2 + stim_b;
          }
        }
        if (assignment_c1 == "mismatch" && assignment_c2 == "nonmoral") {
          if (response_q1 <= 3) {
            var stim = stim_a + positive_nonmoral_t2 + stim_b;
          }
          if (response_q1 >= 4) {
            var stim = stim_a + negative_nonmoral_t2 + stim_b;
          }
        }
        if (assignment_c1 == "mismatch" && assignment_c2 == "moral") {
          if (response_q1 <= 3) {
            var stim = stim_a + positive_moral_t2 + stim_b;
          }
          if (response_q1 >= 4) {
            var stim = stim_a + negative_moral_t2 + stim_b;
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
    "<p>さて、ペア課題を始める前に、お二人には<b>「判断課題」</b>に参加していただきます。</p>" +
    "<p>この課題では、2つの題材について、各自が同じ質問に回答し、互いの回答を閲覧することができます。<br><u>これは、ペア課題に向けて、相手の物事への考え方について知っていただくために行われます</u>。</p>" +
    '<p style="color:red">※20秒後に、自動的に課題がスタートします。少々お待ちください。</p>',
  choices: "NO_KEYS",
  trial_duration: 20000,
};

// topic 1
const judgment_t1 = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<p style="font-size:24px"><b>題材１：昆虫食について</b></p>',
  choices: "NO_KEYS",
  trial_duration: 3000,
};

// Q1
const judgment_t1_q1 = {
  type: jsPsychSurveyLikert,
  preamble: '<p style="text-align:left">' + inst_q1 + "</p>",
  questions: [
    {
      prompt: '<p style="text-align:left">' + t1_sentence + "</p>",
      labels: scale_q1,
      name: "judgment_t1_q1",
      required: true,
    },
  ],
  randomize_question_order: false,
  button_label: next_text,
};

// Q2
const judgment_t1_q2 = {
  type: jsPsychSurveyText,
  preamble: inst_q2,
  questions: [
    {
      prompt:
        "昆虫食についてのあなたの考えを、山口さんに短い文章で自由に伝えてください。<br>（例．あなたが昆虫食に肯定的あるいは否定的な理由）",
      placeholder: "50文字程度で記述してください",
      name: "judgment_t1_q2",
      rows: 3,
      columns: 90,
      required: true,
    },
  ],
  button_label: next_text,
};

// waiting period
var wp_t1 = jsPsych.randomization.randomInt(15000, 20000);
const hourglass_t1 = {
  type: jsPsychImageKeyboardResponse,
  stimulus: img_hourglass,
  stimulus_width: 280,
  stimulus_height: 210,
  maintain_aspect_ratio: false,
  render_on_canvas: false, // required to use .gif animation
  prompt: "現在、山口さんが回答中です。しばらくお待ちください・・・",
  choices: "NO_KEYS",
  trial_duration: wp_t1,
  post_trial_gap: 2000,
};

// result summary
const summary_t1 = make_summary((topic = insect_food));

// follow-up questions
const followup_inst_t1 = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus:
    "<p>昆虫食についての判断課題は以上で終了です。<br>先に進む前に、今の題材について、いくつか追加の質問に回答してください。<br><u>なお、追加の質問への回答は、山口さんには表示されません。</u></p>" +
    '<p style="color:red">※10秒後に、自動的に次のページに移動します。</p>',
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

const mc1_t1 = {
  type: jsPsychSurveyLikert,
  preamble: '<p style="text-align:left">' + inst_mc + "</p>",
  questions: [
    {
      prompt: '<p style="text-align:left">' + items_mc[0] + "</p>",
      labels: scale_mc1,
      name: "mc1_t1",
      required: true,
    },
  ],
  randomize_question_order: false,
  button_label: next_text,
};

const mc2_t1 = {
  type: jsPsychSurveyLikert,
  preamble: '<p style="text-align:left">' + inst_mc + "</p>",
  questions: [
    {
      prompt: '<p style="text-align:left">' + items_mc[1] + "</p>",
      labels: scale_mc2,
      name: "mc2_t1",
      required: true,
    },
  ],
  randomize_question_order: false,
  button_label: next_text,
};

const timeline_mc_t1 = jsPsych.randomization.shuffle([mc1_t1, mc2_t1]);
const mc_blocks_t1 = { timeline: timeline_mc_t1 };

// follow-up 2 (Perceived moral conviction)
const items_pmc = [
  "この話題についての<b>山口さんの</b>立場は、山口さんが根底に持っている道徳的な信念や信条を、どのくらい反映していると思いますか？",
  "この話題についての<b>山口さんの</b>立場は、基本的な善悪についての、山口さんの考え方と、どのくらい関係していると思いますか？",
];

const pmc1_t1 = {
  type: jsPsychSurveyLikert,
  preamble: '<p style="text-align:left">' + inst_mc + "</p>",
  questions: [
    {
      prompt: '<p style="text-align:left">' + items_pmc[0] + "</p>",
      labels: scale_mc1,
      name: "pmc1_t1",
      required: true,
    },
  ],
  randomize_question_order: false,
  button_label: next_text,
};

const pmc2_t1 = {
  type: jsPsychSurveyLikert,
  preamble: '<p style="text-align:left">' + inst_mc + "</p>",
  questions: [
    {
      prompt: '<p style="text-align:left">' + items_pmc[1] + "</p>",
      labels: scale_mc2,
      name: "pmc2_t1",
      required: true,
    },
  ],
  randomize_question_order: false,
  button_label: next_text,
};

const timeline_pmc_t1 = jsPsych.randomization.shuffle([pmc1_t1, pmc2_t1]);
const pmc_blocks_t1 = { timeline: timeline_pmc_t1 };

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

const interest_t1 = {
  type: jsPsychSurveyLikert,
  preamble: '<p style="text-align:left">' + inst_interest + "</p>",
  questions: [
    {
      prompt:
        '<p style="text-align:left">' +
        "あなたは、昆虫食というトピックについて、日常食として取り入れるかどうかは別として、どのくらい関心がありますか？" +
        "</p>",
      labels: scale_interest,
      name: "interest_t1",
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

const p_similarity_t1 = {
  type: jsPsychSurveyLikert,
  preamble: '<p style="text-align:left">' + inst_p_similarity + "</p>",
  questions: [
    {
      prompt:
        '<p style="text-align:left">' +
        "あなたは、自分と山口さんの意見はどれくらい似ていたと思いますか？" +
        "</p>",
      labels: scale_p_similarity,
      name: "p_similarity_t1",
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

const emotionality_t1 = {
  type: jsPsychSurveyLikert,
  preamble: '<p style="text-align:left">' + inst_emotionality + "</p>",
  questions: [
    {
      prompt:
        '<p style="text-align:left">' +
        "このトピックについて、<b>山口さんが抱いている感情</b>は、どのくらい強いものだと思いますか？" +
        "</p>",
      labels: scale_emotionality,
      name: "emotionality_t1",
      required: true,
    },
  ],
  randomize_question_order: false,
  button_label: next_text,
};

// follow-up 6 (TF question)
const inst_tf = "以下の文を読み、正しい答えを選択してください。";

const tf_t1 = {
  type: jsPsychSurveyLikert,
  preamble: '<p style="text-align:left">' + inst_tf + "</p>",
  questions: [
    {
      prompt:
        '<p style="text-align:left">' +
        "昆虫食を日常食とすることに対して、山口さんは積極的である。" +
        "</p>",
      labels: ["誤り", "正しい"],
      name: "tf_t1",
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

const ac_t1 = {
  type: jsPsychSurveyLikert,
  preamble: '<p style="text-align:left">' + inst_ac + "</p>",
  questions: [
    {
      prompt:
        '<p style="text-align:left">' +
        "注意確認項目です。この設問には「6」と回答してください。" +
        "</p>",
      labels: scale_ac,
      name: "ac_t1",
      required: true,
    },
  ],
  randomize_question_order: false,
  button_label: next_text,
};

const timeline_followup_t1 = jsPsych.randomization.shuffle([
  mc_blocks_t1,
  pmc_blocks_t1,
  interest_t1,
  p_similarity_t1,
  emotionality_t1,
  tf_t1,
  ac_t1,
]);

const followup_blocks_t1 = {
  timeline: timeline_followup_t1,
};

const followup_end_t1 = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus:
    "<p>追加の質問は以上です。<br>次のページから、題材２に移ります。</p>" +
    '<p style="color:red">※5秒後に、自動的に次のページに移動します。</p>',
  choices: "NO_KEYS",
  trial_duration: 5000,
};

// topic 2
const judgment_t2 = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<p style="font-size:24px"><b>題材２：AI技術について</b></p>',
  choices: "NO_KEYS",
  trial_duration: 3000,
};

// Q1
const judgment_t2_q1 = {
  type: jsPsychSurveyLikert,
  preamble: '<p style="text-align:left">' + inst_q1 + "</p>",
  questions: [
    {
      prompt: '<p style="text-align:left">' + t2_sentence + "</p>",
      labels: scale_q1,
      name: "judgment_t2_q1",
      required: true,
    },
  ],
  randomize_question_order: false,
  button_label: next_text,
};

// Q2
const judgment_t2_q2 = {
  type: jsPsychSurveyText,
  preamble: inst_q2,
  questions: [
    {
      prompt:
        "AI技術についてのあなたの考えを、山口さんに短い文章で自由に伝えてください。<br>（例．あなたがAI技術に肯定的あるいは否定的な理由）",
      placeholder: "50文字程度で記述してください",
      name: "judgment_t2_q2",
      rows: 3,
      columns: 90,
      required: true,
    },
  ],
  button_label: next_text,
};

// waiting period
var wp_t2 = jsPsych.randomization.randomInt(12000, 18000);
const hourglass_t2 = {
  type: jsPsychImageKeyboardResponse,
  stimulus: img_hourglass,
  stimulus_width: 280,
  stimulus_height: 210,
  maintain_aspect_ratio: false,
  render_on_canvas: false,
  prompt: "現在、山口さんが回答中です。しばらくお待ちください・・・",
  choices: "NO_KEYS",
  trial_duration: wp_t2,
  post_trial_gap: 3000,
};

// result summary
const summary_t2 = make_summary((topic = ai_tech));

// follow-up questions
const followup_inst_t2 = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus:
    "<p>AI技術についての判断課題は以上で終了です。<br>先に進む前に、今の題材について、いくつか追加の質問に回答してください。<br><u>なお、追加の質問への回答は、山口さんには表示されません。</u></p>" +
    '<p style="color:red">※10秒後に、自動的に次のページに移動します。</p>',
  choices: "NO_KEYS",
  trial_duration: 10000,
};

// follow-up 1 (Moral conviction)
const mc1_t2 = {
  type: jsPsychSurveyLikert,
  preamble: '<p style="text-align:left">' + inst_mc + "</p>",
  questions: [
    {
      prompt: '<p style="text-align:left">' + items_mc[0] + "</p>",
      labels: scale_mc1,
      name: "mc1_t2",
      required: true,
    },
  ],
  randomize_question_order: false,
  button_label: next_text,
};

const mc2_t2 = {
  type: jsPsychSurveyLikert,
  preamble: '<p style="text-align:left">' + inst_mc + "</p>",
  questions: [
    {
      prompt: '<p style="text-align:left">' + items_mc[1] + "</p>",
      labels: scale_mc2,
      name: "mc2_t2",
      required: true,
    },
  ],
  randomize_question_order: false,
  button_label: next_text,
};

const timeline_mc_t2 = jsPsych.randomization.shuffle([mc1_t2, mc2_t2]);
const mc_blocks_t2 = { timeline: timeline_mc_t2 };

// follow-up 2 (Perceived moral conviction)
const pmc1_t2 = {
  type: jsPsychSurveyLikert,
  preamble: '<p style="text-align:left">' + inst_mc + "</p>",
  questions: [
    {
      prompt: '<p style="text-align:left">' + items_pmc[0] + "</p>",
      labels: scale_mc1,
      name: "pmc1_t2",
      required: true,
    },
  ],
  randomize_question_order: false,
  button_label: next_text,
};

const pmc2_t2 = {
  type: jsPsychSurveyLikert,
  preamble: '<p style="text-align:left">' + inst_mc + "</p>",
  questions: [
    {
      prompt: '<p style="text-align:left">' + items_pmc[1] + "</p>",
      labels: scale_mc2,
      name: "pmc2_t2",
      required: true,
    },
  ],
  randomize_question_order: false,
  button_label: next_text,
};

const timeline_pmc_t2 = jsPsych.randomization.shuffle([pmc1_t2, pmc2_t2]);
const pmc_blocks_t2 = { timeline: timeline_pmc_t2 };

// follow-up 3 (interest)
const interest_t2 = {
  type: jsPsychSurveyLikert,
  preamble: '<p style="text-align:left">' + inst_interest + "</p>",
  questions: [
    {
      prompt:
        '<p style="text-align:left">' +
        "あなたは、AI技術というトピックについて、自身の生活に取り入れるかどうかは別として、どのくらい関心がありますか？" +
        "</p>",
      labels: scale_interest,
      name: "interest_t2",
      required: true,
    },
  ],
  randomize_question_order: false,
  button_label: next_text,
};

// follow-up 4 (perceived similarity)
const p_similarity_t2 = {
  type: jsPsychSurveyLikert,
  preamble: '<p style="text-align:left">' + inst_p_similarity + "</p>",
  questions: [
    {
      prompt:
        '<p style="text-align:left">' +
        "あなたは、自分と山口さんの意見はどれくらい似ていたと思いますか？" +
        "</p>",
      labels: scale_p_similarity,
      name: "p_similarity_t2",
      required: true,
    },
  ],
  randomize_question_order: false,
  button_label: next_text,
};

// follow-up 5 (emotionality)
const emotionality_t2 = {
  type: jsPsychSurveyLikert,
  preamble: '<p style="text-align:left">' + inst_emotionality + "</p>",
  questions: [
    {
      prompt:
        '<p style="text-align:left">' +
        "このトピックについて、<b>山口さんが抱いている感情</b>は、どのくらい強いものだと思いますか？" +
        "</p>",
      labels: scale_emotionality,
      name: "emotionality_t2",
      required: true,
    },
  ],
  randomize_question_order: false,
  button_label: next_text,
};

// follow-up 6 (TF question)
const tf_t2 = {
  type: jsPsychSurveyLikert,
  preamble: '<p style="text-align:left">' + inst_tf + "</p>",
  questions: [
    {
      prompt:
        '<p style="text-align:left">' +
        "AI技術を日常生活に取り入れることに対して、山口さんは積極的である。" +
        "</p>",
      labels: ["誤り", "正しい"],
      name: "tf_t2",
      required: true,
    },
  ],
  randomize_question_order: false,
  button_label: next_text,
};

// follow-up 7 (attention checks)
const ac_t2 = {
  type: jsPsychSurveyLikert,
  preamble: '<p style="text-align:left">' + inst_ac + "</p>",
  questions: [
    {
      prompt:
        '<p style="text-align:left">' +
        "注意確認項目です。この設問には「3」と回答してください。" +
        "</p>",
      labels: scale_ac,
      name: "ac_t2",
      required: true,
    },
  ],
  randomize_question_order: false,
  button_label: next_text,
};

const timeline_followup_t2 = jsPsych.randomization.shuffle([
  mc_blocks_t2,
  pmc_blocks_t2,
  interest_t2,
  p_similarity_t2,
  emotionality_t2,
  tf_t2,
  ac_t2,
]);

const followup_blocks_t2 = {
  timeline: timeline_followup_t2,
};

const followup_end_t2 = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus:
    "<p>追加の質問は以上です。<br>また、以上で「判断課題」は終了です。</p>" +
    '<p style="color:red">※5秒後に、自動的に次のページに移動します。</p>',
  choices: "NO_KEYS",
  trial_duration: 5000,
};

// impression
const srg_inst = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus:
    "<p>次のページから、<b>現時点での山口さんの印象</b>について回答していただきます。<br><u>なお、質問への回答は、山口さんには表示されません。</u></p>" +
    '<p style="color:red">※10秒後に、自動的に次のページに移動します。</p>',
  choices: "NO_KEYS",
  trial_duration: 10000,
};

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
  // attention check
  "注意確認項目です。この設問には「2」と回答してください。",
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
  "srg_ac",
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
    (scale = scale_general),
    (names = names_srg)
  );
  srg_block[i] = make_block((inst = inst_general), (qs = qs_srg[i]));
  timeline_srg.push(srg_block[i]);
}

const srg_blocks = {
  timeline: timeline_srg,
};

// waiting period
var wp3 = jsPsych.randomization.randomInt(10000, 15000);
const hourglass3 = {
  type: jsPsychImageKeyboardResponse,
  stimulus: img_hourglass,
  stimulus_width: 280,
  stimulus_height: 210,
  maintain_aspect_ratio: false,
  render_on_canvas: false,
  prompt: "現在、山口さんが回答中です。しばらくお待ちください・・・",
  choices: "NO_KEYS",
  trial_duration: wp3,
  post_trial_gap: 2000,
};

// dependent measures
const dv_inst = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus:
    "<p>それでは、これから<b>「ペア課題」</b>を開始します。<br><b>ペア課題では、日本のとある政治的トピックについて、チャット形式で会話をしていただきます。</b></p>" +
    "<p>課題を開始する前に、いくつかの質問に回答してください。<br><u>なお、あなたの回答は、山口さんには表示されません。</u></p>" +
    '<p style="color:red">※20秒後に、自動的に次のページに移動します。</p>',
  choices: "NO_KEYS",
  trial_duration: 20000,
};

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
    (scale = scale_general),
    (names = names_dv)
  );
  dv_block[i] = make_block((inst = inst_general), (qs = qs_dv[i]));
  timeline_dv.push(dv_block[i]);
}

const dv_blocks = {
  timeline: timeline_dv,
};

// end
const complete = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus:
    "<p>ご協力いただき、ありがとうございました。以上で実験プログラムは終了です。</p>" +
    "<p>これから、冒頭の調査用ページに戻ります。その後は、画面の指示に従って、先に進んでください。</p>" +
    '<p style="color:red">※20秒後に、自動的に画面が遷移します。しばらくお待ちください。</p>',
  choices: "NO_KEYS",
  trial_duration: 20000,
};

// timeline
const questionnaire = {
  timeline: [
    intro,
    age,
    sex,
    ideology_blocks,
    pairing_start,
    hourglass,
    nickname_self,
    nickname_info,
    judgment_inst,
    judgment_t1,
    judgment_t1_q1,
    judgment_t1_q2,
    hourglass_t1,
    summary_t1,
    followup_inst_t1,
    followup_blocks_t1,
    followup_end_t1,
    judgment_t2,
    judgment_t2_q1,
    judgment_t2_q2,
    hourglass_t2,
    summary_t2,
    followup_inst_t2,
    followup_blocks_t2,
    followup_end_t2,
    srg_inst,
    srg_blocks,
    hourglass3,
    dv_inst,
    dv_blocks,
    complete,
  ],
};
