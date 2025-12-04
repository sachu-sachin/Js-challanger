const STORAGE_KEY = 'js-challenger-progress';

/**
 * Get all progress data from localStorage
 * @returns {Object} Progress data object
 */
export function getProgress() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : {};
    } catch (error) {
        console.error('Error loading progress from localStorage:', error);
        return {};
    }
}

/**
 * Save progress data to localStorage
 * @param {Object} progressData - Progress data object
 */
export function saveProgress(progressData) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progressData));
    } catch (error) {
        console.error('Error saving progress to localStorage:', error);
    }
}

/**
 * Get progress for a specific task
 * @param {string} topicId - Topic ID
 * @param {string} taskId - Task ID
 * @returns {Object|null} Task progress object or null if not found
 */
export function getTaskProgress(topicId, taskId) {
    const progress = getProgress();
    return progress[topicId]?.[taskId] || null;
}

/**
 * Save progress for a specific task
 * @param {string} topicId - Topic ID
 * @param {string} taskId - Task ID
 * @param {Object} taskProgress - Task progress data
 */
export function saveTaskProgress(topicId, taskId, taskProgress) {
    const progress = getProgress();
    
    if (!progress[topicId]) {
        progress[topicId] = {};
    }
    
    progress[topicId][taskId] = {
        ...taskProgress,
        lastAccessed: Date.now()
    };
    
    saveProgress(progress);
}

/**
 * Get all task progress for a topic
 * @param {string} topicId - Topic ID
 * @returns {Object} Object mapping taskId to progress
 */
export function getTopicProgress(topicId) {
    const progress = getProgress();
    return progress[topicId] || {};
}

/**
 * Update step completion for a task
 * @param {string} topicId - Topic ID
 * @param {string} taskId - Task ID
 * @param {number} stepIndex - Index of completed step
 * @param {number} totalSteps - Total number of steps
 * @param {boolean} hasQuiz - Whether task has a quiz
 */
export function markStepComplete(topicId, taskId, stepIndex, totalSteps, hasQuiz) {
    const currentProgress = getTaskProgress(topicId, taskId) || {
        completedSteps: [],
        quizCompleted: false,
        completed: false
    };
    
    // Add step index if not already completed
    if (!currentProgress.completedSteps.includes(stepIndex)) {
        currentProgress.completedSteps.push(stepIndex);
        currentProgress.completedSteps.sort((a, b) => a - b);
    }
    
    // Check if all steps are completed
    const allStepsCompleted = currentProgress.completedSteps.length === totalSteps;
    
    // Task is complete if all steps are done and (no quiz exists or quiz is completed)
    currentProgress.completed = allStepsCompleted && (!hasQuiz || currentProgress.quizCompleted);
    
    saveTaskProgress(topicId, taskId, currentProgress);
}

/**
 * Mark quiz as completed for a task
 * @param {string} topicId - Topic ID
 * @param {string} taskId - Task ID
 * @param {number} totalSteps - Total number of steps
 */
export function markQuizComplete(topicId, taskId, totalSteps) {
    const currentProgress = getTaskProgress(topicId, taskId) || {
        completedSteps: [],
        quizCompleted: false,
        completed: false
    };
    
    currentProgress.quizCompleted = true;
    
    // Task is complete if all steps are done and quiz is completed
    const allStepsCompleted = currentProgress.completedSteps.length === totalSteps;
    currentProgress.completed = allStepsCompleted && currentProgress.quizCompleted;
    
    saveTaskProgress(topicId, taskId, currentProgress);
}

/**
 * Clear all progress (useful for reset functionality)
 */
export function clearProgress() {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error('Error clearing progress from localStorage:', error);
    }
}

/**
 * Clear progress for a specific topic
 * @param {string} topicId - Topic ID
 */
export function clearTopicProgress(topicId) {
    const progress = getProgress();
    delete progress[topicId];
    saveProgress(progress);
}

/**
 * Clear progress for a specific task
 * @param {string} topicId - Topic ID
 * @param {string} taskId - Task ID
 */
export function clearTaskProgress(topicId, taskId) {
    const progress = getProgress();
    if (progress[topicId] && progress[topicId][taskId]) {
        delete progress[topicId][taskId];
        saveProgress(progress);
    }
}

