import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RotateCcw, ExternalLink } from "lucide-react"

export function Flashcards() {
  // Sample data matching your structure
  const [data] = useState({
    summary: "A conflict of interest occurs when an individual's personal interests clash with the interests of another person or organization to whom they owe a duty of loyalty. This can manifest as benefiting oneself at the expense of an employer or facing conflicting obligations to different parties. In business and law, a fiduciary responsibility creates a duty of loyalty. Ethical individuals should actively avoid situations where personal gain leads to disloyalty towards others, which can be a tough balancing act.",
    questions: [
      {
        question: "What is a conflict of interest?",
        options: [
          "When a person's best interest clashes with the interest of someone they owe loyalty to.",
          "When two people disagree on a topic.",
          "When someone changes their mind about something.",
          "When a person has too many responsibilities."
        ],
        answer: "When a person's best interest clashes with the interest of someone they owe loyalty to."
      },
      {
        question: "What is a duty of loyalty?",
        options: [
          "A legal obligation to act in the best interest of another party.",
          "The freedom to act in one's own self-interest.",
          "An obligation to harm another party.",
          "A voluntary agreement with no legal standing."
        ],
        answer: "A legal obligation to act in the best interest of another party."
      },
      {
        question: "Who do auditors owe a duty of loyalty to?",
        options: [
          "The investors who rely on the financial reports.",
          "The company being audited.",
          "Their own auditing firm.",
          "Government regulators only."
        ],
        answer: "The investors who rely on the financial reports."
      },
      {
        question: "What is an example of a conflict of interest involving an employee?",
        options: [
          "An employee taking a bribe to purchase inferior goods for their company.",
          "An employee working overtime without pay.",
          "An employee taking vacation time.",
          "An employee asking for a promotion."
        ],
        answer: "An employee taking a bribe to purchase inferior goods for their company."
      },
      {
        question: "What should ethical people do to avoid conflicts of interest?",
        options: [
          "Consciously avoid situations where they benefit themselves by being disloyal to others.",
          "Always prioritize their own interests first.",
          "Ignore potential conflicts and hope for the best.",
          "Only work for themselves to avoid loyalty issues."
        ],
        answer: "Consciously avoid situations where they benefit themselves by being disloyal to others."
      },
      {
        question: "What creates a duty of loyalty in business and law?",
        options: [
          "A fiduciary responsibility.",
          "A casual agreement.",
          "Personal friendship.",
          "Government mandate only."
        ],
        answer: "A fiduciary responsibility."
      },
      {
        question: "What is the main challenge in avoiding conflicts of interest?",
        options: [
          "Balancing personal gain with loyalty to others.",
          "Understanding complex legal terms.",
          "Finding enough time in the day.",
          "Communicating with stakeholders."
        ],
        answer: "Balancing personal gain with loyalty to others."
      },
      {
        question: "When can conflicts of interest manifest?",
        options: [
          "When benefiting oneself at the expense of an employer.",
          "When working extra hours.",
          "When following company policy.",
          "When taking lunch breaks."
        ],
        answer: "When benefiting oneself at the expense of an employer."
      },
      {
        question: "What type of obligations can create conflicts of interest?",
        options: [
          "Conflicting obligations to different parties.",
          "Single obligations to one party.",
          "Voluntary community service.",
          "Personal hobby commitments."
        ],
        answer: "Conflicting obligations to different parties."
      },
      {
        question: "Who is most affected by conflicts of interest in business?",
        options: [
          "Those who are owed loyalty by the conflicted party.",
          "The conflicted party themselves.",
          "Government officials.",
          "Competitors in the market."
        ],
        answer: "Those who are owed loyalty by the conflicted party."
      },
      {
        question: "What is required for ethical behavior regarding conflicts?",
        options: [
          "Active avoidance of conflicting situations.",
          "Passive awareness only.",
          "Legal consultation for every decision.",
          "Complete isolation from business dealings."
        ],
        answer: "Active avoidance of conflicting situations."
      },
      {
        question: "In what fields are conflicts of interest particularly important?",
        options: [
          "Business and law.",
          "Sports and entertainment.",
          "Art and music.",
          "Tourism and hospitality."
        ],
        answer: "Business and law."
      },
      {
        question: "What makes conflicts of interest ethically problematic?",
        options: [
          "They involve disloyalty to parties who deserve loyalty.",
          "They are always illegal.",
          "They require too much paperwork.",
          "They are time-consuming to resolve."
        ],
        answer: "They involve disloyalty to parties who deserve loyalty."
      },
      {
        question: "What is the relationship between personal interests and conflicts?",
        options: [
          "Personal interests can clash with duties to others.",
          "Personal interests are always more important.",
          "Personal interests never affect professional duties.",
          "Personal interests should be ignored completely."
        ],
        answer: "Personal interests can clash with duties to others."
      },
      {
        question: "How should organizations handle conflicts of interest?",
        options: [
          "Establish clear policies and disclosure requirements.",
          "Ignore them unless they become public.",
          "Leave it up to individual judgment only.",
          "Ban all personal interests of employees."
        ],
        answer: "Establish clear policies and disclosure requirements."
      },
      {
        question: "What is the ultimate goal of managing conflicts of interest?",
        options: [
          "Maintaining trust and integrity in professional relationships.",
          "Maximizing profits for the organization.",
          "Avoiding all legal liability.",
          "Simplifying decision-making processes."
        ],
        answer: "Maintaining trust and integrity in professional relationships."
      }
    ],
    recommendations: [
      {
        topic: "Ethics in Business",
        link: "https://www.scu.edu/ethics/focus-areas/business-ethics/"
      },
      {
        topic: "Fiduciary Duty",
        link: "https://www.investopedia.com/terms/f/fiduciary.asp"
      },
      {
        topic: "Corporate Governance",
        link: "https://corpgov.law.harvard.edu/"
      }
    ]
  })

  const [flippedCards, setFlippedCards] = useState(new Set())

  const flipCard = (index) => {
    const newFlipped = new Set(flippedCards)
    if (newFlipped.has(index)) {
      newFlipped.delete(index)
    } else {
      newFlipped.add(index)
    }
    setFlippedCards(newFlipped)
  }

  const resetAll = () => {
    setFlippedCards(new Set())
  }

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Topic Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-blue-800 leading-relaxed">
            {data.summary}
          </p>
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="flex justify-between items-center">
        <Button onClick={resetAll} variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset All
        </Button>
        <div className="text-sm font-medium text-blue-700">
          Click cards to reveal answers
        </div>
      </div>

      {/* Flashcards Grid */}
      <div className="grid grid-cols-4 gap-4">
        {data.questions.map((item, index) => (
          <div key={index} className="relative h-56 perspective-1000">
            <div 
              className={`absolute inset-0 w-full h-full transition-transform duration-700 transform-style-preserve-3d cursor-pointer ${
                flippedCards.has(index) ? 'rotate-y-180' : ''
              }`}
              onClick={() => flipCard(index)}
            >
              {/* Front Side - Question */}
              <Card className="absolute inset-0 w-full h-full backface-hidden bg-gradient-to-br from-blue-500 to-blue-700 text-white border-blue-400 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6 h-full flex flex-col justify-between">
                  <div>
                    <div className="text-xs text-blue-200 mb-3 font-medium">
                      Question {index + 1}
                    </div>
                    <h3 className="text-sm font-semibold leading-tight text-white">
                      {item.question}
                    </h3>
                  </div>
                  <div className="text-xs text-blue-200 italic">
                    Click to reveal answer
                  </div>
                </CardContent>
              </Card>

              {/* Back Side - Answer */}
              <Card className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-blue-600 to-blue-800 text-white border-blue-500 shadow-lg">
                <CardContent className="p-6 h-full flex flex-col justify-center">
                  <div className="text-center">
                    <div className="text-xs text-blue-200 mb-4 font-medium">
                      Answer
                    </div>
                    <div className="text-sm font-medium leading-relaxed text-blue-50 bg-blue-700/50 p-4 rounded-lg backdrop-blur-sm">
                      {item.answer}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ))}
      </div>

      {/* Recommendations */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Recommended Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.recommendations.map((rec, index) => (
              <a
                key={index}
                href={rec.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 group shadow-sm"
              >
                <span className="text-sm font-medium text-blue-800">{rec.topic}</span>
                <ExternalLink className="w-4 h-4 text-blue-600 group-hover:text-blue-800 transition-colors" />
              </a>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Custom CSS for 3D flip animation */}
      <style >{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  )
}