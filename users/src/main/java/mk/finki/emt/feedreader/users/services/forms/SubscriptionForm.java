package mk.finki.emt.feedreader.users.services.forms;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import lombok.Data;

/**
 * This class represents the subscription form,
 * that consists of a username and the id to the feed source that
 * the user is subscribing to
 */
@Data
public class SubscriptionForm {

  @NotNull
  @NotBlank
  @NotEmpty
  private String username;

  @NotNull
  @NotBlank
  @NotEmpty
  private String feedSourceId;

  @JsonCreator
  public SubscriptionForm(
    @JsonProperty("username") String username,
    @JsonProperty("feedSourceId") String feedSourceId
  ) {
    this.username = username;
    this.feedSourceId = feedSourceId;
  }
}
