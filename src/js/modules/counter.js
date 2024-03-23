// Sample Module
const increaseCount = () => {
  const button = document.querySelector('.count-button');
  const counterSpan = document.getElementById('counterValue');
  let count = 0;

  const updateCounter = () => {
    count += 1; // Increment count by 1
    counterSpan.textContent = `(${count})`;
  };

  button.addEventListener('click', updateCounter);
};

export default increaseCount;
