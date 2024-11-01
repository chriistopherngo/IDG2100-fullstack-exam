function pickAssessmentIcon(category) {
    // Convert the category to lower case - this property is also lower case in the database, so it has to be checked case insensitively here
    const lowerCaseCategory = category.toLowerCase()
    let defaultIcon

    // Returns the path for the relevant default image
    switch (lowerCaseCategory) {
        case "who is assessed":
            return defaultIcon = "uploads/icon-assessed.png"
        case "the assessor":
            return defaultIcon = "uploads/icon-assessor.png"
        case "assessment artefact":
            return defaultIcon = "uploads/icon-artefact.png"
        case "assessment format":
            return defaultIcon = "uploads/icon-format.png"
        case "context":
            return defaultIcon = "uploads/icon-context.png"
        case "assessment timing":
            return defaultIcon = "uploads/icon-timing.png"
        default:
            return defaultIcon = "uploads/icon-assessment.png"
    }
}


module.exports = {pickAssessmentIcon}