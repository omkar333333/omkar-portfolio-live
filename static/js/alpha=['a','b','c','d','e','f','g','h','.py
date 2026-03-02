secret_word = input("Enter a word: ")
guesses = ""
points = 3

while True:
    display = ""
    
    for char in secret_word:
        if char in guesses:
            display += char
        else:
            display += "_"
        
    print("Word:", display)

    if display == secret_word:
        print("You got it!")
        break

    if points == 0:
        print("Game over! The word was:", secret_word)
        break

    letter = input("Guess a letter: ")

    if letter in secret_word:
        print("Correct!")
    else:
        print("Wrong!")
        points -= 1
        print("Points left:", points)

    guesses += letter