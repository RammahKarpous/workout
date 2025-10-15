export default () => {
    const workoutGenerator = document.querySelector('.workout-generator');
    if (!workoutGenerator) return;

    const button = workoutGenerator.querySelector('button');
    let temporaryId = '';
    let workoutName = '';
    
    button.addEventListener('click', () => {
        temporaryId = workoutGenerator.querySelector('[data-temporary-id]').getAttribute('data-temporary-id');
        workoutName = workoutGenerator.querySelector('[data-workout-name]').getAttribute('data-workout-name');
        console.log(temporaryId, workoutName);
    });
}