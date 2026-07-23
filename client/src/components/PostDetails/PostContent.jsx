import React from 'react';
import DisplayQuill from '../../components/DisplayQuill';
import { CheckCircle2 } from 'lucide-react';

const PostContent = ({ activeTab, post }) => {
  if (activeTab !== 'experience') {
    return (
      <div className="py-8 text-center text-gray-500">
        <p>Content for {activeTab} will go here.</p>
      </div>
    );
  }

  // Dummy fallback data if post doesn't have rounds
  const rounds = post?.rounds?.length > 0 ? post.rounds : [
    {
      roundType: "Online Assessment",
      duration: "",
      difficulty: "",
      experienceAndTips: "2 coding questions (Medium) on DSA and 1 behavioral question.",
      status: "Cleared" // assuming we have a status, otherwise hardcode
    },
    {
      roundType: "Technical Phone Screen",
      duration: "",
      difficulty: "",
      experienceAndTips: "1 coding question (Medium-Hard) and discussion on projects.",
      status: "Cleared"
    },
    {
      roundType: "Onsite Rounds",
      duration: "",
      difficulty: "",
      experienceAndTips: "4 rounds (2 Coding + 1 System Design + 1 Behavioral)",
      status: "Cleared"
    },
    {
      roundType: "HR Round",
      duration: "",
      difficulty: "",
      experienceAndTips: "Discussion on resume, projects, and situational questions.",
      status: "Cleared"
    }
  ];

  const tips = post?.overallTips ? [post.overallTips] : [
    "Revise core DSA concepts thoroughly.",
    "Practice system design (LLD + HLD).",
    "Be clear about your projects and be ready to deep dive.",
    "Communicate your approach clearly during coding."
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* About the Role */}
      <section>
        <h3 className="text-lg font-bold text-gray-900 mb-3">About the Role</h3>
        <div className="text-gray-700 leading-relaxed text-[15px]">
          {post?.content ? (
            <DisplayQuill content={post.content} />
          ) : (
            <p>
              I interviewed for the SDE Intern role at Google (Bangalore). The internship is for 10-12 weeks. It was a fantastic experience with a smooth and well-structured process.
            </p>
          )}
        </div>
      </section>

      {/* Interview Process Timeline */}
      <section>
        <h3 className="text-lg font-bold text-gray-900 mb-5">Interview Process</h3>
        <div className="flex flex-col gap-6 relative">
          {/* Vertical line behind timeline */}
          <div className="absolute left-3 top-2 bottom-6 w-[2px] bg-gray-100 z-0"></div>
          
          {rounds.map((round, index) => (
            <div key={index} className="flex gap-4 relative z-10">
              {/* Timeline Icon */}
              <div className="mt-1">
                <div className="w-6 h-6 rounded-full bg-white border-2 border-green-500 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                </div>
              </div>
              
              {/* Timeline Content */}
              <div className="flex-1">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                      Step {index + 1}
                    </span>
                    <h4 className="font-bold text-gray-900 text-[15px]">{round.roundType}</h4>
                    <div className="text-gray-600 text-[14px] mt-1 leading-relaxed">
                      {round.experienceAndTips}
                    </div>
                  </div>
                  
                  {/* Status Badge */}
                  <span className="bg-green-50 text-green-700 px-3 py-1 rounded-md text-xs font-bold border border-green-100 whitespace-nowrap">
                    {round.status || "Cleared"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Onsite Experience (if applicable) */}
      <section>
        <h3 className="text-lg font-bold text-gray-900 mb-3">Onsite Experience</h3>
        <div className="text-gray-700 leading-relaxed text-[15px]">
          <p>The onsite was conducted at Google office, Bangalore. The interviewers were friendly and professional. Each round lasted about <strong>45 minutes</strong>.</p>
        </div>
      </section>

      {/* Tips for Future Candidates */}
      <section>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Tips for Future Candidates</h3>
        <ul className="flex flex-col gap-3">
          {tips.map((tip, idx) => (
            <li key={idx} className="flex gap-3 items-start">
              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <span className="text-gray-700 text-[15px] leading-relaxed">{tip}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default PostContent;
