using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class PersistenceMigration_2024_04_19T01_48 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "encodings",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "text", nullable: false),
                    code_page = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_encoding", x => x.id);
                });
            
            
            migrationBuilder.InsertData(
                table: "encodings",
                columns: new[] { "id", "code_page", "name" },
                values: new object[,]
                {
                    { 1L, 65001, "UTF-8" },
                    { 2L, 1200, "UTF-16" },
                    { 3L, 1201, "UTF-16BE" },
                    { 4L, 12000, "UTF-32" },
                    { 5L, 12001, "UTF-32BE" },
                    { 6L, 1252, "Windows-1252" },
                    { 7L, 1250, "Windows-1250" },
                    { 8L, 1251, "Windows-1251" },
                    { 9L, 1253, "Windows-1253" },
                    { 10L, 1254, "Windows-1254" },
                    { 11L, 1255, "Windows-1255" },
                    { 12L, 1256, "Windows-1256" },
                    { 13L, 1257, "Windows-1257" },
                    { 14L, 1258, "Windows-1258" },
                    { 15L, 28591, "ISO-8859-1" },
                    { 16L, 28592, "ISO-8859-2" },
                    { 17L, 28595, "ISO-8859-5" },
                    { 18L, 28597, "ISO-8859-7" },
                    { 19L, 28598, "ISO-8859-8" },
                    { 20L, 28599, "ISO-8859-9" },
                    { 21L, 20866, "KOI8-R" },
                    { 22L, 21866, "KOI8-RU" },
                    { 23L, 932, "Shift_JIS" },
                    { 24L, 20932, "EUC-JP" },
                    { 25L, 866, "CP866" },
                    { 26L, 1254, "CP1254" },
                    { 27L, 1255, "CP1255" },
                    { 28L, 1256, "CP1256" },
                    { 29L, 1257, "CP1257" },
                    { 30L, 1258, "CP1258" },
                    { 31L, 437, "CP437" },
                    { 32L, 850, "CP850" },
                    { 33L, 852, "CP852" },
                    { 34L, 855, "CP855" },
                    { 35L, 857, "CP857" },
                    { 36L, 860, "CP860" },
                    { 37L, 861, "CP861" },
                    { 38L, 862, "CP862" },
                    { 39L, 863, "CP863" },
                    { 40L, 864, "CP864" },
                    { 41L, 865, "CP865" },
                    { 42L, 869, "CP869" },
                    { 43L, 950, "Big5" }
                });

            migrationBuilder.CreateIndex(
                name: "ix_encoding_code_page",
                table: "encodings",
                column: "code_page");

            migrationBuilder.CreateIndex(
                name: "ix_encoding_name",
                table: "encodings",
                column: "name");
            
            migrationBuilder.AddColumn<long>(
                name: "encoding_id",
                table: "servers",
                type: "bigint",
                nullable: false,
                defaultValue: 1L);

            migrationBuilder.AddForeignKey(
                name: "fk_servers_encoding_encoding_id",
                table: "servers",
                column: "encoding_id",
                principalTable: "encodings",
                principalColumn: "id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_servers_encoding_encoding_id",
                table: "servers");

            migrationBuilder.DropIndex(
                name: "ix_encoding_code_page",
                table: "encodings");

            migrationBuilder.DropIndex(
                name: "ix_encoding_name",
                table: "encodings");
            
            migrationBuilder.DropTable(
                name: "encodings");

            migrationBuilder.DeleteData(
                table: "encodings",
                keyColumn: "id",
                keyValue: 1L);

            migrationBuilder.DeleteData(
                table: "encodings",
                keyColumn: "id",
                keyValue: 2L);

            migrationBuilder.DeleteData(
                table: "encodings",
                keyColumn: "id",
                keyValue: 3L);

            migrationBuilder.DeleteData(
                table: "encodings",
                keyColumn: "id",
                keyValue: 4L);

            migrationBuilder.DeleteData(
                table: "encodings",
                keyColumn: "id",
                keyValue: 5L);

            migrationBuilder.DeleteData(
                table: "encodings",
                keyColumn: "id",
                keyValue: 6L);

            migrationBuilder.DeleteData(
                table: "encodings",
                keyColumn: "id",
                keyValue: 7L);

            migrationBuilder.DeleteData(
                table: "encodings",
                keyColumn: "id",
                keyValue: 8L);

            migrationBuilder.DeleteData(
                table: "encodings",
                keyColumn: "id",
                keyValue: 9L);

            migrationBuilder.DeleteData(
                table: "encodings",
                keyColumn: "id",
                keyValue: 10L);

            migrationBuilder.DeleteData(
                table: "encodings",
                keyColumn: "id",
                keyValue: 11L);

            migrationBuilder.DeleteData(
                table: "encodings",
                keyColumn: "id",
                keyValue: 12L);

            migrationBuilder.DeleteData(
                table: "encodings",
                keyColumn: "id",
                keyValue: 13L);

            migrationBuilder.DeleteData(
                table: "encodings",
                keyColumn: "id",
                keyValue: 14L);

            migrationBuilder.DeleteData(
                table: "encodings",
                keyColumn: "id",
                keyValue: 15L);

            migrationBuilder.DeleteData(
                table: "encodings",
                keyColumn: "id",
                keyValue: 16L);

            migrationBuilder.DeleteData(
                table: "encodings",
                keyColumn: "id",
                keyValue: 17L);

            migrationBuilder.DeleteData(
                table: "encodings",
                keyColumn: "id",
                keyValue: 18L);

            migrationBuilder.DeleteData(
                table: "encodings",
                keyColumn: "id",
                keyValue: 19L);

            migrationBuilder.DeleteData(
                table: "encodings",
                keyColumn: "id",
                keyValue: 20L);

            migrationBuilder.DeleteData(
                table: "encodings",
                keyColumn: "id",
                keyValue: 21L);

            migrationBuilder.DeleteData(
                table: "encodings",
                keyColumn: "id",
                keyValue: 22L);

            migrationBuilder.DeleteData(
                table: "encodings",
                keyColumn: "id",
                keyValue: 23L);

            migrationBuilder.DeleteData(
                table: "encodings",
                keyColumn: "id",
                keyValue: 24L);

            migrationBuilder.DeleteData(
                table: "encodings",
                keyColumn: "id",
                keyValue: 25L);

            migrationBuilder.DeleteData(
                table: "encodings",
                keyColumn: "id",
                keyValue: 26L);

            migrationBuilder.DeleteData(
                table: "encodings",
                keyColumn: "id",
                keyValue: 27L);

            migrationBuilder.DeleteData(
                table: "encodings",
                keyColumn: "id",
                keyValue: 28L);

            migrationBuilder.DeleteData(
                table: "encodings",
                keyColumn: "id",
                keyValue: 29L);

            migrationBuilder.DeleteData(
                table: "encodings",
                keyColumn: "id",
                keyValue: 30L);

            migrationBuilder.DeleteData(
                table: "encodings",
                keyColumn: "id",
                keyValue: 31L);

            migrationBuilder.DeleteData(
                table: "encodings",
                keyColumn: "id",
                keyValue: 32L);

            migrationBuilder.DeleteData(
                table: "encodings",
                keyColumn: "id",
                keyValue: 33L);

            migrationBuilder.DeleteData(
                table: "encodings",
                keyColumn: "id",
                keyValue: 34L);

            migrationBuilder.DeleteData(
                table: "encodings",
                keyColumn: "id",
                keyValue: 35L);

            migrationBuilder.DeleteData(
                table: "encodings",
                keyColumn: "id",
                keyValue: 36L);

            migrationBuilder.DeleteData(
                table: "encodings",
                keyColumn: "id",
                keyValue: 37L);

            migrationBuilder.DeleteData(
                table: "encodings",
                keyColumn: "id",
                keyValue: 38L);

            migrationBuilder.DeleteData(
                table: "encodings",
                keyColumn: "id",
                keyValue: 39L);

            migrationBuilder.DeleteData(
                table: "encodings",
                keyColumn: "id",
                keyValue: 40L);

            migrationBuilder.DeleteData(
                table: "encodings",
                keyColumn: "id",
                keyValue: 41L);

            migrationBuilder.DeleteData(
                table: "encodings",
                keyColumn: "id",
                keyValue: 42L);

            migrationBuilder.DeleteData(
                table: "encodings",
                keyColumn: "id",
                keyValue: 43L);
        }
    }
}
