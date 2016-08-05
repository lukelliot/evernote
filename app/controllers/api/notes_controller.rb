class Api::NotesController < ApplicationController
  # before_action: :require_logged_in

  def index
    @notes = current_user.notes
    render :index
  end

  def show
    @note = current_user.notes.find(params[:id])
    render :show
  end

  def create
    @note = current_user.notes.new(note_params)

    if @note.save
      render :show
    else
      render json: @note.errors.full_messages, status: 422
    end
  end

  def update
    @note = current_user.notes.find(params[:id])

    if current_user_is_author? && safely_updates?
      render :show
    else
      render json: @note.errors.full_messages, status: 422
    end
  end

  def destroy
    @note = current_user.notes.find(params[:id])
    if current_user_is_author? && safely_destroys
      render :show
    else
      render json: ["Could not delete #{note.title}"], status: 403
    end
  end

  private

  def safely_destroys
    @note.destroy
  end

  def safely_updates?
    @note.update_attributes(note_params)
  end

  def current_user_is_author?
    current_user.id = @note.author.id
  end

  def note_params
    params.require(:note).permit(
      :title,
      :content,
      :notebook_id,
    )
  end
end
