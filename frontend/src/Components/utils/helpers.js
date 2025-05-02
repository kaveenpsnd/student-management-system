// Format date to MM/DD/YYYY
export const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    })
  }
  
  // Calculate grade from score
  export const calculateGrade = (score) => {
    if (score >= 90) return { grade: "A+", remarks: "Outstanding" }
    if (score >= 80) return { grade: "A", remarks: "Excellent" }
    if (score >= 75) return { grade: "B+", remarks: "Very Good" }
    if (score >= 70) return { grade: "B", remarks: "Good" }
    if (score >= 65) return { grade: "C+", remarks: "Above Average" }
    if (score >= 60) return { grade: "C", remarks: "Average" }
    if (score >= 55) return { grade: "D+", remarks: "Below Average" }
    if (score >= 50) return { grade: "D", remarks: "Pass" }
    return { grade: "F", remarks: "Fail" }
  }
  
  // Calculate total and average scores
  export const calculateScoreSummary = (subjects) => {
    const validScores = subjects
      .filter((subject) => subject.name && !isNaN(Number(subject.score)))
      .map((subject) => Number(subject.score))
  
    const totalScore = validScores.reduce((sum, score) => sum + score, 0)
    const averageScore = validScores.length > 0 ? (totalScore / validScores.length).toFixed(2) : 0
    const percentage = validScores.length > 0 ? ((totalScore / (validScores.length * 100)) * 100).toFixed(2) : 0
  
    // Calculate final grade based on average score
    const { grade: finalGrade } = calculateGrade(averageScore)
  
    return {
      totalScore,
      averageScore,
      percentage,
      finalGrade,
    }
  }
  
  // Generate student ID
  export const generateStudentId = (grade, sequence) => {
    const year = new Date().getFullYear().toString().slice(-2)
    const gradeNum = grade.replace(/\D/g, "").padStart(2, "0")
    const seq = sequence.toString().padStart(3, "0")
    return `STU${year}${gradeNum}${seq}`
  }
  
  