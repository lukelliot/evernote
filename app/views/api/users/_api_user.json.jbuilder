json.extract! api_user, :id, :username, :session_token, :password_digest, :created_at, :updated_at
json.url api_user_url(api_user, format: :json)