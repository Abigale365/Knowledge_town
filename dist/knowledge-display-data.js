const KnowledgeDisplayErrata={
  "schemaVersion": 1,
  "kind": "knowledge-display-errata",
  "candidateRevision": 1,
  "status": "proposed-not-applied",
  "displayOnly": true,
  "changesFrozenKnowledge": false,
  "changesCourseOrGameBindings": false,
  "integrated": false,
  "knowledge": {
    "id": "aib-knowledge",
    "revision": 3,
    "hash": "f28f8ca8e808bb7eb8f135b3a761a2bdd9b86a37e4ce1c47f8f69de5fccb19ce"
  },
  "sourceAnalysisHash": "9431ea7d0fac0b495f3ca1e59d754336f94ade1025b5bde48a65fc3b7bc45236",
  "checkedRoutes": [
    {
      "catalogKey": "legacy4",
      "courseId": "course-11fu42t",
      "courseHash": "e7810674993ba0ad9e5712d9464b52db62897faf2c046be53b98bec4eafeee66",
      "teachingRevision": 4
    },
    {
      "catalogKey": "legacy5",
      "courseId": "course-87vtar",
      "courseHash": "6306df554e58e8305558b1141dd0eb77d12801dd78178bcfe0c951c7fc66bb21",
      "teachingRevision": 5
    },
    {
      "catalogKey": "aib4",
      "courseId": "course-2iajim",
      "courseHash": "7560539a241e2676fe1ced373aa74f80a192ec9a31a9c5ec27baa5a131a084b4",
      "teachingRevision": 4
    },
    {
      "catalogKey": "aib5",
      "courseId": "course-c5mcdg",
      "courseHash": "c69ed0b965a4e5897b966bba41407c4a385cecd66895e091a0b247d2d05a31b4",
      "teachingRevision": 5
    }
  ],
  "corrections": [
    {
      "issueId": "prediction-underestimate-example",
      "sourceUnitId": "1.1-lesson-5",
      "unitHash": "0a66209c7b6e5857bce834004a90451eb22b7fe52d8d16bfb4d0a0735f0b8cfa",
      "field": "en.example",
      "before": "Overestimating demand can increase excess inventory.",
      "after": "Overestimating demand may create excess inventory; underestimating it may cause stockouts.",
      "correspondingChinese": "需求高估可能造成库存积压；低估则可能造成缺货。",
      "reason": {
        "zh": "英文例示缺少中文已有的低估/缺货分支；保留可能性，不新增实测结论。",
        "en": "The English example omits the existing Chinese underestimation/stockout branch; preserve uncertainty without adding an empirical claim."
      },
      "binding": {
        "catalogKey": "legacy4",
        "courseId": "course-11fu42t",
        "courseHash": "e7810674993ba0ad9e5712d9464b52db62897faf2c046be53b98bec4eafeee66",
        "teachingRevision": 4,
        "lessonId": "1.1-lesson-12",
        "lessonHash": "aa9bf74d1ac0d90d308463afcf796dcadf99340a63c543e3bafb7970d996eaff",
        "sectionId": "1.1"
      },
      "reviewedUnitEvidence": [
        {
          "materialId": "reviewed-primary-sources-r3",
          "locator": "UTF16:2643-2727",
          "quote": "AI inference is the act of using a trained AI model to make predictions on new data."
        },
        {
          "materialId": "reviewed-primary-sources-r3",
          "locator": "UTF16:17650-17747",
          "quote": "Design evals that mirror your real-world task distribution. Don't forget to factor in edge cases!"
        },
        {
          "materialId": "reviewed-primary-sources-r3",
          "locator": "UTF16:19833-19910",
          "quote": "Prepare and document plans for continuous monitoring and feedback mechanisms."
        }
      ],
      "sourceIds": [
        "d1-inference",
        "r3-d1-eval",
        "r3-d1-manage"
      ]
    },
    {
      "issueId": "data-quality-model-limit",
      "sourceUnitId": "1.1-lesson-11",
      "unitHash": "39cf6540d8e4208ffb34575de23c226b3fa3c1ca40f7ca8cdfd7aeca5f8de016",
      "field": "en.body",
      "before": "The fitness of data for its intended use, including accuracy, completeness, consistency, timeliness and relevance.",
      "after": "Data quality must be assessed for the intended use, including accuracy, completeness, consistency, timeliness and relevance. A larger model cannot automatically repair every data defect.",
      "correspondingChinese": "数据质量要结合用途检查准确性、完整性、一致性、时效性及相关性。更大的模型无法自动补救所有数据缺陷。",
      "reason": {
        "zh": "英文定义遗漏中文与冻结审校英文中的更大模型不能自动补救所有数据缺陷的边界。",
        "en": "The English definition omits the Chinese and reviewed-English limit that a larger model cannot automatically repair every data defect."
      },
      "binding": {
        "catalogKey": "legacy4",
        "courseId": "course-11fu42t",
        "courseHash": "e7810674993ba0ad9e5712d9464b52db62897faf2c046be53b98bec4eafeee66",
        "teachingRevision": 4,
        "lessonId": "1.1-lesson-18",
        "lessonHash": "f6eef529fe5c28a09c9b9b495eeb5135368d84b499035d874c0ff8664eefb7bc",
        "sectionId": "1.1"
      },
      "reviewedUnitEvidence": [
        {
          "materialId": "reviewed-primary-sources-r3",
          "locator": "UTF16:2183-2276",
          "quote": "accuracy, completeness, validity, consistency, uniqueness, timeliness and fitness for purpose"
        }
      ],
      "sourceIds": [
        "d1-quality"
      ]
    },
    {
      "issueId": "framework-accuracy-limit",
      "sourceUnitId": "1.1-lesson-14",
      "unitHash": "304ac3a6864d46a12a7f9971b7712fb084d8633c5c321f9beccc78a709398828",
      "field": "en.body",
      "before": "Consistent definitions help teams distinguish models, algorithms, training and inference when making decisions.",
      "after": "Teams should first agree on the meanings of terms such as algorithm, model, training and inference before discussing solutions. Standards or frameworks can organize concepts, but do not guarantee accuracy.",
      "correspondingChinese": "团队应先统一算法、模型、训练和推理等词的含义，再讨论方案。标准或框架可以帮助组织概念，但不能当作准确率保证。",
      "reason": {
        "zh": "英文定义遗漏中文与冻结审校英文中的框架不保证准确率的限制。",
        "en": "The English definition omits the Chinese and reviewed-English limit that frameworks do not guarantee accuracy."
      },
      "binding": {
        "catalogKey": "legacy4",
        "courseId": "course-11fu42t",
        "courseHash": "e7810674993ba0ad9e5712d9464b52db62897faf2c046be53b98bec4eafeee66",
        "teachingRevision": 4,
        "lessonId": "1.1-lesson-21",
        "lessonHash": "c9c3c36402e8c6c5b31ed2f731474f0cac7a901e444a8e22c99a27e8d1fe9b07",
        "sectionId": "1.1"
      },
      "reviewedUnitEvidence": [
        {
          "materialId": "reviewed-primary-sources-r3",
          "locator": "UTF16:3257-3395",
          "quote": "provides a conceptual framework and shared terminology for describing artificial intelligence (AI) systems that use machine learning (ML)."
        }
      ],
      "sourceIds": [
        "d1-iso23053"
      ]
    },
    {
      "issueId": "prediction-underestimate-example",
      "sourceUnitId": "1.1-lesson-5",
      "unitHash": "0a66209c7b6e5857bce834004a90451eb22b7fe52d8d16bfb4d0a0735f0b8cfa",
      "field": "en.example",
      "before": "Overestimating demand can increase excess inventory.",
      "after": "Overestimating demand may create excess inventory; underestimating it may cause stockouts.",
      "correspondingChinese": "需求高估可能造成库存积压；低估则可能造成缺货。",
      "reason": {
        "zh": "英文例示缺少中文已有的低估/缺货分支；保留可能性，不新增实测结论。",
        "en": "The English example omits the existing Chinese underestimation/stockout branch; preserve uncertainty without adding an empirical claim."
      },
      "binding": {
        "catalogKey": "legacy5",
        "courseId": "course-87vtar",
        "courseHash": "6306df554e58e8305558b1141dd0eb77d12801dd78178bcfe0c951c7fc66bb21",
        "teachingRevision": 5,
        "lessonId": "1.1-lesson-12",
        "lessonHash": "aa9bf74d1ac0d90d308463afcf796dcadf99340a63c543e3bafb7970d996eaff",
        "sectionId": "1.1"
      },
      "reviewedUnitEvidence": [
        {
          "materialId": "reviewed-primary-sources-r3",
          "locator": "UTF16:2643-2727",
          "quote": "AI inference is the act of using a trained AI model to make predictions on new data."
        },
        {
          "materialId": "reviewed-primary-sources-r3",
          "locator": "UTF16:17650-17747",
          "quote": "Design evals that mirror your real-world task distribution. Don't forget to factor in edge cases!"
        },
        {
          "materialId": "reviewed-primary-sources-r3",
          "locator": "UTF16:19833-19910",
          "quote": "Prepare and document plans for continuous monitoring and feedback mechanisms."
        }
      ],
      "sourceIds": [
        "d1-inference",
        "r3-d1-eval",
        "r3-d1-manage"
      ]
    },
    {
      "issueId": "data-quality-model-limit",
      "sourceUnitId": "1.1-lesson-11",
      "unitHash": "39cf6540d8e4208ffb34575de23c226b3fa3c1ca40f7ca8cdfd7aeca5f8de016",
      "field": "en.body",
      "before": "The fitness of data for its intended use, including accuracy, completeness, consistency, timeliness and relevance.",
      "after": "Data quality must be assessed for the intended use, including accuracy, completeness, consistency, timeliness and relevance. A larger model cannot automatically repair every data defect.",
      "correspondingChinese": "数据质量要结合用途检查准确性、完整性、一致性、时效性及相关性。更大的模型无法自动补救所有数据缺陷。",
      "reason": {
        "zh": "英文定义遗漏中文与冻结审校英文中的更大模型不能自动补救所有数据缺陷的边界。",
        "en": "The English definition omits the Chinese and reviewed-English limit that a larger model cannot automatically repair every data defect."
      },
      "binding": {
        "catalogKey": "legacy5",
        "courseId": "course-87vtar",
        "courseHash": "6306df554e58e8305558b1141dd0eb77d12801dd78178bcfe0c951c7fc66bb21",
        "teachingRevision": 5,
        "lessonId": "1.1-lesson-18",
        "lessonHash": "f6eef529fe5c28a09c9b9b495eeb5135368d84b499035d874c0ff8664eefb7bc",
        "sectionId": "1.1"
      },
      "reviewedUnitEvidence": [
        {
          "materialId": "reviewed-primary-sources-r3",
          "locator": "UTF16:2183-2276",
          "quote": "accuracy, completeness, validity, consistency, uniqueness, timeliness and fitness for purpose"
        }
      ],
      "sourceIds": [
        "d1-quality"
      ]
    },
    {
      "issueId": "framework-accuracy-limit",
      "sourceUnitId": "1.1-lesson-14",
      "unitHash": "304ac3a6864d46a12a7f9971b7712fb084d8633c5c321f9beccc78a709398828",
      "field": "en.body",
      "before": "Consistent definitions help teams distinguish models, algorithms, training and inference when making decisions.",
      "after": "Teams should first agree on the meanings of terms such as algorithm, model, training and inference before discussing solutions. Standards or frameworks can organize concepts, but do not guarantee accuracy.",
      "correspondingChinese": "团队应先统一算法、模型、训练和推理等词的含义，再讨论方案。标准或框架可以帮助组织概念，但不能当作准确率保证。",
      "reason": {
        "zh": "英文定义遗漏中文与冻结审校英文中的框架不保证准确率的限制。",
        "en": "The English definition omits the Chinese and reviewed-English limit that frameworks do not guarantee accuracy."
      },
      "binding": {
        "catalogKey": "legacy5",
        "courseId": "course-87vtar",
        "courseHash": "6306df554e58e8305558b1141dd0eb77d12801dd78178bcfe0c951c7fc66bb21",
        "teachingRevision": 5,
        "lessonId": "1.1-lesson-21",
        "lessonHash": "c9c3c36402e8c6c5b31ed2f731474f0cac7a901e444a8e22c99a27e8d1fe9b07",
        "sectionId": "1.1"
      },
      "reviewedUnitEvidence": [
        {
          "materialId": "reviewed-primary-sources-r3",
          "locator": "UTF16:3257-3395",
          "quote": "provides a conceptual framework and shared terminology for describing artificial intelligence (AI) systems that use machine learning (ML)."
        }
      ],
      "sourceIds": [
        "d1-iso23053"
      ]
    }
  ],
  "sources": [
    {
      "id": "d1-inference",
      "title": "AI inference — IBM",
      "url": "https://www.ibm.com/think/topics/ai-inference",
      "excerpt": "AI inference is the act of using a trained AI model to make predictions on new data.",
      "verifiedAt": "2026-10-20"
    },
    {
      "id": "r3-d1-eval",
      "title": "Define success criteria and build evaluations — Anthropic",
      "url": "https://platform.claude.com/docs/en/test-and-evaluate/develop-tests",
      "excerpt": "Design evals that mirror your real-world task distribution. Don't forget to factor in edge cases!",
      "verifiedAt": "2026-10-20"
    },
    {
      "id": "r3-d1-manage",
      "title": "AI RMF Playbook: Manage — NIST",
      "url": "https://airc.nist.gov/airmf-resources/playbook/manage/",
      "excerpt": "Prepare and document plans for continuous monitoring and feedback mechanisms.",
      "verifiedAt": "2026-10-20"
    },
    {
      "id": "d1-quality",
      "title": "Data quality — IBM",
      "url": "https://www.ibm.com/think/topics/data-quality",
      "excerpt": "accuracy, completeness, validity, consistency, uniqueness, timeliness and fitness for purpose",
      "verifiedAt": "2026-10-20"
    },
    {
      "id": "d1-iso23053",
      "title": "ISO/IEC 23053 official overview",
      "url": "https://www.iso.org/standard/74438.html",
      "excerpt": "provides a conceptual framework and shared terminology for describing artificial intelligence (AI) systems that use machine learning (ML).",
      "verifiedAt": "2026-10-20"
    }
  ],
  "integrationNote": "Project a display copy only. Course/lesson hashes and saved game contexts must continue to use the original reviewed course objects. Rebinding or replacing B data is outside this candidate."
};
