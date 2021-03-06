package mk.finki.emt.feedreader.feeds.domain.models;

import java.time.Instant;
import javax.persistence.Entity;
import javax.persistence.Lob;
import javax.persistence.Table;
import lombok.Getter;
import mk.finki.emt.feedreader.feeds.domain.valueObjects.Author;
import mk.finki.emt.feedreader.feeds.domain.valueObjects.Image;
import mk.finki.emt.feedreader.feeds.domain.valueObjects.Link;
import mk.finki.emt.feedreader.sharedkernel.domain.base.AbstractEntity;
import org.hibernate.annotations.Type;

/**
 * The article class defines the entity to be used for storing the article,
 * no other functionality present here, because of the rules of the DDD approach
 */
@Getter
@Entity
@Table(name = "article")
public class Article extends AbstractEntity<ArticleId> {

  private String title;

  private Link link;

  /**
   * The Lob and type annotations are used to allow the value in the database to exceed the 255 max character limit
   */
  @Lob
  @Type(type = "org.hibernate.type.TextType")
  private String summary;

  private String category;

  private Instant published;

  private Author author;

  private Image image;

  protected Article() {
    super(ArticleId.randomId(ArticleId.class));
    this.title = null;
    this.link = null;
    this.summary = null;
    this.category = null;
    this.published = null;
    this.author = null;
    this.image = null;
  }

  public Article(
    String title,
    Link link,
    String summary,
    String category,
    Instant published,
    Author author,
    Image image
  ) {
    super(ArticleId.randomId(ArticleId.class));
    this.title = title;
    this.link = link;
    this.summary = summary;
    this.category = category;
    this.published = published;
    this.author = author;
    this.image = image;
  }
}
