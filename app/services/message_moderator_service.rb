class MessageModeratorService

    def self.message_approved?(message)

        if message_contains_bad_words?(message)
            check_message_with_context(message)
        else
            true
        end
    end

    private

    def self.message_contains_bad_words?(message)
        splitted_message = message.body.split(' ')
        splitted_message.any? { |word| BAD_WORDS.include?(word.downcase) }
    end

    def self.check_message_with_context(message)
        url = "https://api.openai.com/v1/moderations"
    
        response = HTTParty.post(url,
            headers: {
                "Content-Type" => "application/json",
                "Authorization" => "Bearer #{ENV['OPENAI_API_KEY']}"
            },
            body: {
                input: message.body,
            }.to_json
        )

        puts response
        flagged = response["results"][0]["flagged"]

        # Return true(message approved) if the message is not flagged
        return !flagged
    end
end